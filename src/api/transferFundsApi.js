import axios from "axios";
import apiUrl from "../apiConfig";

// Function to handle fund transfer API request
export const transferFundsApi = async (transferData, userToken) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${apiUrl}/transfer-funds`, // Use the correct backend endpoint
      headers: {
        Authorization: `Token token=${userToken}`, // Include user token for authorization
      },
      data: {
        transferType: transferData.transferType,
        bankName: transferData.bankName,
        routingNumber: transferData.routingNumber,
        bankAccount: transferData.bankAccount,
        amount: transferData.amount,
      },
    });

    return response.data.transfer; // Return the transfer data if successful
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error; // Throw error so it can be handled by the caller
  }
};
