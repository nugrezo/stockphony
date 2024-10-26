import React, { useState, useEffect } from "react";
import {
  getBankInfo,
  updateBankInfo as updateBankInfoApi,
} from "../../../api/accountApi"; // Import the API functions
import { useStocks } from "../AdminOperations/StockContext"; // Import useStocks to access context
import "./BankInfoForm.css"; // Import the CSS for styling

const BankInfoForm = ({ user, msgAlert }) => {
  const { updateBankInfo } = useStocks(); // Access updateBankInfo from context

  const [bankName, setBankName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch existing bank info when the component mounts
  useEffect(() => {
    if (!user || !user.token) return; // Check if user and token are available

    const fetchBankInfo = async () => {
      try {
        setIsFetching(true); // Set loading state
        const response = await getBankInfo(user.token); // Fetch bank info from API

        console.log("Fetched Bank Info:", response.data);

        // Destructure the bank info data and set the state
        const { bankName, routingNumber, bankAccountNumber } = response;

        // Populate the form with existing bank info
        setBankName(bankName || "");
        setRoutingNumber(routingNumber || "");
        setBankAccountNumber(bankAccountNumber || "");

        // Update context with fetched bank info
        updateBankInfo({ bankName, routingNumber, bankAccountNumber });

        setIsFetching(false); // Turn off loading state
      } catch (error) {
        console.error("Error fetching bank info:", error);
        setIsFetching(false);
        msgAlert({
          heading: "Error",
          message: "Failed to fetch bank information.",
          variant: "danger",
        });
      }
    };

    fetchBankInfo(); // Call the fetch function
  }, [user.token]); // Only re-trigger when user.token changes

  const handleBankNameChange = (event) => setBankName(event.target.value);
  const handleRoutingNumberChange = (event) =>
    setRoutingNumber(event.target.value);
  const handleBankAccountNumberChange = (event) =>
    setBankAccountNumber(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!bankName || !routingNumber || !bankAccountNumber) {
      msgAlert({
        heading: "Invalid Input",
        message: "Please fill in all fields.",
        variant: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const bankInfo = {
        bankName,
        routingNumber,
        bankAccountNumber,
      };

      // Make API call to update bank info
      await updateBankInfoApi(user.token, bankInfo);

      // Update context with the newly submitted bank info
      updateBankInfo(bankInfo);

      msgAlert({
        heading: "Success",
        message: "Bank information updated successfully!",
        variant: "success",
      });

      // Optionally clear the form fields after successful submission
      setBankName("");
      setRoutingNumber("");
      setBankAccountNumber("");
    } catch (error) {
      msgAlert({
        heading: "Update Failed",
        message: "Failed to update bank information.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render loading state while fetching existing bank info
  if (isFetching) {
    return <p>Loading bank information...</p>;
  }

  return (
    <div className="bank-info-form">
      <form onSubmit={handleSubmit}>
        <h3>Register Bank Information</h3>

        <div className="form-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            value={bankName}
            onChange={handleBankNameChange}
            placeholder="Enter bank name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="routingNumber">Routing Number</label>
          <input
            type="text"
            id="routingNumber"
            value={routingNumber}
            onChange={handleRoutingNumberChange}
            placeholder="Enter routing number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankAccountNumber">Bank Account Number</label>
          <input
            type="text"
            id="bankAccountNumber"
            value={bankAccountNumber}
            onChange={handleBankAccountNumberChange}
            placeholder="Enter bank account number"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Register Bank Info"}
        </button>
      </form>
    </div>
  );
};

export default BankInfoForm;
