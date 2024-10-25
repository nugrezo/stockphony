import axios from "axios";
import apiUrl from "../apiConfig";

export const fetchAccountInfo = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/account-info`, {
      headers: {
        Authorization: `Token token=${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch account info:", error);
    throw error;
  }
};

// Fetch bank information for the user
export const getBankInfo = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/bank-info`, {
      headers: {
        Authorization: `Token token=${token}`,
      },
    });
    return response.data.bankInfo; // Return only the bank info
  } catch (error) {
    console.error("Failed to fetch bank info:", error);
    throw error;
  }
};

export const updateBankInfo = async (token, bankInfo) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/update-bank-info`,
      { bankInfo }, // Send bank info in the request body
      {
        headers: {
          Authorization: `Token token=${token}`, // Pass user token for authentication
        },
      }
    );
    console.log("API Response:", response.data); // Log the full API response

    return response.data.user; // Assuming the API returns updated user object
  } catch (error) {
    console.error("Error updating bank info:", error);
    throw error;
  }
};
