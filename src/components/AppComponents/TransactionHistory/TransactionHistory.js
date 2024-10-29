import React from "react";
import "./TransactionHistory.css"; // Importing the CSS for consistent styling

const TransactionHistory = ({ transactions }) => {
  // Format dates to a readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>
      <div className="transaction-table">
        {/* Table Headers */}
        <div className="transaction-row header">
          <span>Transaction Date</span>
          <span>Transaction Type</span>
          <span>Amount</span>
        </div>

        {/* Dynamic Transaction Data */}
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-row">
            <span>{formatDate(transaction.date)}</span>
            <span>{transaction.type}</span>
            <span
              className={`amount ${
                transaction.amount >= 0 ? "positive" : "negative"
              }`}
            >
              ${Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
