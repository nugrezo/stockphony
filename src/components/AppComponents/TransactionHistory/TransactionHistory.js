// TransactionHistory.js

import React, { useEffect, useState } from "react";
import { fetchTransactionsHistory } from "../../../api/transactionsHistoryApi";
import "./TransactionHistory.css";

const TransactionHistory = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetchTransactionsHistory(user);
        console.log("Fetched Transactions:", response.data.transactions);

        // Check if the response data is structured as { transactions: [...] }
        setTransactions(response.data.transactions || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Unable to load transactions. Please try again later.");
      }
    };

    if (user) {
      loadTransactions();
    }
  }, [user]);

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
      {error && <p className="error-message">{error}</p>}
      {transactions.length > 0 ? (
        <div className="transaction-table">
          <div className="transaction-row header">
            <span>Transaction Date</span>
            <span>Transaction Type</span>
            <span>Amount</span>
          </div>

          {transactions.map((transaction, index) => (
            <div key={transaction._id || index} className="transaction-row">
              <span>{formatDate(transaction.createdAt)}</span>
              <span>{transaction.transactionType}</span>
              <span
                className={`amount ${
                  transaction.amount >= 0 ? "positive" : "negative"
                }`}
              >
                {formatCurrency(transaction.amount)} {/* Format the amount */}
              </span>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;
