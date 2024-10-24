import axios from "axios";
import apiUrl from "../apiConfig";

// Function to set the market schedule (POST)
export const setMarketScheduleApi = (scheduleData, adminToken) => {
  return axios({
    method: "POST",
    url: `${apiUrl}/set-market-schedule`,
    headers: {
      Authorization: `Token token=${adminToken}`, // Use the same authorization logic as in the addStock function
    },
    data: {
      openTime: scheduleData.openTime,
      closeTime: scheduleData.closeTime,
      holidays: scheduleData.holidays,
    },
  })
    .then((response) => {
      console.log("Market schedule set successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Failed to set market schedule:", error);
      throw error;
    });
};

// Function to fetch the market schedule (GET)
export const fetchMarketScheduleApi = async (user) => {
  try {
    console.log("Sending token for fetching market schedule:", user.token);
    const response = await axios.get(`${apiUrl}/market-schedule`, {
      headers: {
        Authorization: `Token token=${user.token}`, // User token for authorization
      },
    });
    console.log("Market schedule fetched from API:", response.data.schedule);
    return response.data.schedule;
  } catch (error) {
    console.error("Failed to fetch market schedule:", error);
    throw error;
  }
};
