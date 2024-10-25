import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import messages from "../../AutoDismissAlert/messages"; // Import messages
import "./TransferFunds.css";
import { transferFundsApi } from "../../../api/transferFundsApi"; // Import the API function
import { useStocks } from "../AdminOperations/StockContext";

const TransferFunds = ({ msgAlert }) => {
  const { user } = useStocks();
  const [transferType, setTransferType] = useState("toStockphony");
  const [bankName, setBankName] = useState("");
  const [routingNumber, setRoutingNumber] = useState(""); // New routing number state
  const [bankAccount, setBankAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for button

  const handleTransferTypeChange = (event) =>
    setTransferType(event.target.value);
  const handleBankNameChange = (event) => setBankName(event.target.value);
  const handleRoutingNumberChange = (event) =>
    setRoutingNumber(event.target.value); // New routing number handler
  const handleBankAccountChange = (event) => setBankAccount(event.target.value);
  const handleAmountChange = (event) => setAmount(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all fields are filled in
    if (!bankName || !bankAccount || !amount || !routingNumber) {
      msgAlert({
        heading: "Invalid Input",
        message: "Please fill in all fields.",
        variant: "danger",
      });
      return;
    }

    try {
      setLoading(true);

      // Call the API to submit the transfer
      const transferData = {
        transferType,
        bankName,
        routingNumber,
        bankAccount,
        amount,
      };

      await transferFundsApi(transferData, user.token); // Call the transfer API

      msgAlert({
        heading: "Transfer Success",
        message: messages.transferSuccess,
        variant: "success",
      });

      // Reset form fields on success
      setBankName("");
      setRoutingNumber(""); // Reset routing number
      setBankAccount("");
      setAmount("");
    } catch (error) {
      msgAlert({
        heading: "Transfer Failed",
        message: messages.transferFailure,
        variant: "danger",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="transfer-funds">
      <h2>Transfer Funds</h2>
      <Form className="transfer-funds-container" onSubmit={handleSubmit}>
        <Form.Group as={Col} controlId="formTransferType">
          <Form.Label>Select Transfer Type:</Form.Label>
          <Form.Select
            aria-label="Select Transfer Type"
            value={transferType}
            onChange={handleTransferTypeChange}
          >
            <option value="toStockphony">Transfer to Stockphony Account</option>
            <option value="fromStockphony">
              Transfer from Stockphony Account to Bank
            </option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formBankName">
          <Form.Label>Bank Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter bank name"
            value={bankName}
            onChange={handleBankNameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRoutingNumber">
          <Form.Label>Routing Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter routing number"
            value={routingNumber}
            onChange={handleRoutingNumberChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBankAccount">
          <Form.Label>Bank Account Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter bank account number"
            value={bankAccount}
            onChange={handleBankAccountChange}
            required
          />
        </Form.Group>

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
  );
};

export default TransferFunds;
