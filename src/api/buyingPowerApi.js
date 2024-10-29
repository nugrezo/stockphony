// buyingPowerApi.js

import axios from "axios";
import apiUrl from "../apiConfig";

// Fetch user's buying power
export const fetchBuyingPower = async (user) => {
  console.log("Fetching buying power for user:", user._id); // Log request initiation

  try {
    const response = await axios({
      method: "GET",
      url: `${apiUrl}/buyingPower`,
      headers: {
        Authorization: `Token token=${user.token}`,
      },
    });
    console.log("Buying power response:", response.data); // Log response data

    return response.data.buyingPower;
  } catch (error) {
    console.error("Failed to fetch buying power:", error);
    throw error;
  }
};

// Create a buying power entry
export const createBuyingPower = async (user, initialAmount = 10000) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${apiUrl}/buyingPower`,
      headers: {
        Authorization: `Token token=${user.token}`,
      },
      data: {
        amount: initialAmount,
      },
    });
    return response.data.buyingPower;
  } catch (error) {
    console.error("Failed to create buying power:", error);
    throw error;
  }
};

// Update buying power for a user
export const updateBuyingPower = async (user, amount) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${apiUrl}/buyingPower`,
      headers: {
        Authorization: `Token token=${user.token}`,
      },
      data: {
        amount,
      },
    });
    return response.data.buyingPower;
  } catch (error) {
    console.error("Failed to update buying power:", error);
    throw error;
  }
};
