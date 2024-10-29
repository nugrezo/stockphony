import axios from "axios";
import apiUrl from "../apiConfig";

// Fetch Transaction History (GET)
export const fetchTransactionsHistory = (user) => {
  // Uses the user's token for authorization
  return axios({
    method: "GET",
    url: `${apiUrl}/transactions`,
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

// Create New Transaction (POST)
export const createTransaction = (user, transactionData) => {
  // Accepts user and transactionData, uses user's token for authorization
  return axios({
    method: "POST",
    url: `${apiUrl}/transactions`,
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    data: transactionData, // The transaction data to be posted
  });
};
