import React, { useEffect, useState } from "react";
import { fetchAccountInfo } from "../../../api/accountApi";
import "./AccountInfo.css";

const AccountInfo = ({ user, msgAlert }) => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAccountInfo(user.token); // Fetch account info using the token
        console.log("Fetched Account Info:", data); // Debugging line
        setAccountInfo(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load account information.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  if (loading) {
    return <p>Loading account information...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="account-info-wrapper">
      {/* Account Info Section */}
      <div className="account-info-container">
        <h2>Account Information</h2>
        <ul className="account-info-grid account-info-list">
          <li>
            <span className="account-info-label">Full Name:</span>
            <input
              className="account-info-value"
              type="text"
              value={accountInfo.fullName}
              readOnly
            />
          </li>
          <li>
            <span className="account-info-label">Email:</span>
            <input
              className="account-info-value"
              type="text"
              value={accountInfo.email}
              readOnly
            />
          </li>
          <li>
            <span className="account-info-label">Username:</span>
            <input
              className="account-info-value"
              type="text"
              value={accountInfo.username}
              readOnly
            />
          </li>
          <li>
            <span className="account-info-label">
              StockPhony Account Number:
            </span>
            <input
              className="account-info-value"
              type="text"
              value={accountInfo.stockphonyAccountNumber}
              readOnly
            />
          </li>
          <li>
            <span className="account-info-label">Password:</span>
            <input
              className="account-info-value"
              type="password"
              value="********"
              readOnly
            />
          </li>
        </ul>
      </div>

      {/* Bank Info Section */}
      <div className="bank-info-container">
        <h2>Bank Information</h2>
        <ul className="account-info-grid bank-info-list">
          <li>
            <span className="bank-info-label">Bank Name:</span>
            <input
              className="bank-info-value"
              type="text"
              value={accountInfo.bankInfo?.bankName || "N/A"}
              readOnly
            />
          </li>
          <li>
            <span className="bank-info-label">Routing Number:</span>
            <input
              className="bank-info-value"
              type="text"
              value={accountInfo.bankInfo?.routingNumber || "N/A"}
              readOnly
            />
          </li>
          <li>
            <span className="bank-info-label">Bank Account Number:</span>
            <input
              className="bank-info-value"
              type="text"
              value={accountInfo.bankInfo?.bankAccountNumber || "N/A"}
              readOnly
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountInfo;
