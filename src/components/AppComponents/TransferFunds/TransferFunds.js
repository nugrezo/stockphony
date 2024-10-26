import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import messages from "../../AutoDismissAlert/messages";
import "./TransferFunds.css";
import { transferFundsApi } from "../../../api/transferFundsApi";
import { useStocks } from "../AdminOperations/StockContext";

const TransferFunds = ({ msgAlert }) => {
  const {
    user,
    bankInfo,
    increaseBuyingPower,
    decreaseBuyingPower,
    buyingPower,
  } = useStocks();
  const [transferType, setTransferType] = useState("toStockphony");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleTransferTypeChange = (event) =>
    setTransferType(event.target.value);
  const handleAmountChange = (event) => setAmount(event.target.value);

  const handleBankSelection = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue !== "select") {
      setSelectedBank(bankInfo); // Set the bankInfo if a valid bank is selected
    } else {
      setSelectedBank(null); // Reset the bank selection if "Select Registered Bank" is chosen
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if bank is selected
    if (!selectedBank) {
      msgAlert({
        heading: "Bank Not Selected",
        message:
          "Please select a registered bank to proceed with the transaction.",
        variant: "danger",
      });
      return;
    }

    // Check if amount exceeds buying power for "fromStockphony" transfers
    if (transferType === "fromStockphony" && parseFloat(amount) > buyingPower) {
      msgAlert({
        heading: "Insufficient Funds",
        message:
          "Not enough cash to transfer. Please check your available buying power.",
        variant: "danger",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      msgAlert({
        heading: "Invalid Amount",
        message: "Please enter a valid transfer amount.",
        variant: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const transferData = {
        transferType,
        bankName: bankInfo.bankName,
        routingNumber: bankInfo.routingNumber,
        bankAccount: bankInfo.bankAccountNumber,
        amount,
      };

      await transferFundsApi(transferData, user.token);

      msgAlert({
        heading: "Transfer Success",
        message: messages.transferSuccess,
        variant: "success",
      });

      // Update buying power based on transfer type
      if (transferType === "toStockphony") {
        increaseBuyingPower(parseFloat(amount));
      } else if (transferType === "fromStockphony") {
        decreaseBuyingPower(parseFloat(amount));
      }

      // Clear amount field after submission
      setAmount("");
    } catch (error) {
      msgAlert({
        heading: "Transfer Failed",
        message: messages.transferFailure,
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-funds">
      <h2>Transfer Funds</h2>
      <div className="transfer-funds-container">
        <Form onSubmit={handleSubmit}>
          <div className="transfer-funds-form-group">
            <Form.Group as={Col} controlId="formTransferType">
              <Form.Label>Select Transfer Type:</Form.Label>
              <Form.Select
                value={transferType}
                onChange={handleTransferTypeChange}
              >
                <option value="toStockphony">
                  Transfer to Stockphony Account
                </option>
                <option value="fromStockphony">
                  Transfer from Stockphony Account to Bank
                </option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="transfer-funds-form-group">
            {/* Registered Bank Dropdown */}
            <Form.Group as={Col} controlId="formBankSelection">
              <Form.Label>Registered Bank</Form.Label>
              <Form.Select onChange={handleBankSelection}>
                <option value="select">Select Registered Bank</option>
                {bankInfo && (
                  <option value={bankInfo.bankName}>{bankInfo.bankName}</option>
                )}
              </Form.Select>
            </Form.Group>
          </div>
          {/* Slide Down Bank Details */}
          {selectedBank && (
            <div className="bank-details">
              {/* Headers */}
              <div className="bank-item header">
                <span>Bank Name</span>
                <span>Routing Number</span>
                <span>Account Number</span>
              </div>

              {/* Bank data values */}
              <div className="bank-item">
                <span>{selectedBank.bankName}</span>
                <span>{selectedBank.routingNumber}</span>
                <span>{selectedBank.bankAccountNumber}</span>
              </div>
            </div>
          )}
          <div className="transfer-funds-form-group">
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                required
              />
            </Form.Group>
          </div>
          <Button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Transfer"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default TransferFunds;
