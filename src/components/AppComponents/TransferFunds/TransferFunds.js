// TransferFunds.js

import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import messages from "../../AutoDismissAlert/messages";
import "./TransferFunds.css";
import { transferFundsApi } from "../../../api/transferFundsApi"; // Import transfer API
import { useStocks } from "../AdminOperations/StockContext";
import { updateBuyingPower } from "../../../api/buyingPowerApi"; // Direct import for updateBuyingPower

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
    setSelectedBank(selectedValue !== "select" ? bankInfo : null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedBank) {
      msgAlert({
        heading: "Bank Not Selected",
        message:
          "Please select a registered bank to proceed with the transaction.",
        variant: "danger",
      });
      return;
    }

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

      // Call transferFundsApi to process the transfer
      await transferFundsApi(transferData, user.token);

      msgAlert({
        heading: "Transfer Success",
        message: messages.transferSuccess,
        variant: "success",
      });

      // Update buying power in the frontend state and backend
      if (transferType === "toStockphony") {
        increaseBuyingPower(parseFloat(amount));
        await updateBuyingPower(user, buyingPower + parseFloat(amount)); // Sync with backend
      } else if (transferType === "fromStockphony") {
        decreaseBuyingPower(parseFloat(amount));
        await updateBuyingPower(user, buyingPower - parseFloat(amount)); // Sync with backend
      }

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
      <div className="transfer-funds-container">
        <h2>Transfer Funds</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Col} controlId="formTransferType">
            <Form.Label>Select Transfer Type</Form.Label>
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
          <Form.Group as={Col} controlId="formBankSelection">
            <Form.Label>Select Bank</Form.Label>
            <Form.Select onChange={handleBankSelection}>
              <option value="select">Select Registered Bank</option>
              {bankInfo && (
                <option value={bankInfo.bankName}>{bankInfo.bankName}</option>
              )}
            </Form.Select>
          </Form.Group>
          {selectedBank && (
            <div className="bank-details">
              <div className="bank-item header">
                <span>Bank Name</span>
                <span>Routing Number</span>
                <span>Account Number</span>
              </div>
              <div className="bank-item">
                <span>{selectedBank.bankName}</span>
                <span>{selectedBank.routingNumber}</span>
                <span>{selectedBank.bankAccountNumber}</span>
              </div>
            </div>
          )}
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
          <Button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Transfer"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default TransferFunds;
