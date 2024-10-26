import axios from "axios";
import apiUrl from "../apiConfig";

export const addStock = (stockData, adminToken) => {
  const change = stockData.initialPrice - stockData.dayLow;
  const changePercent = ((change / stockData.dayLow) * 100).toFixed(2);
  return axios({
    method: "POST",
    url: apiUrl + "/stocks",
    headers: {
      Authorization: `Token token=${adminToken}`,
    },
    data: {
      stock: {
        companyName: stockData.companyName,
        stockTicker: stockData.stockTicker,
        stockVolume: stockData.stockVolume,
        initialPrice: stockData.initialPrice,
        dayHigh: stockData.dayHigh, // Include dayHigh
        dayLow: stockData.dayLow, // Include dayLow
        change, // Add calculated change
        changePercent, // Add calculated changePercent
      },
    },
  });
};

// Function to fetch all stocks from the backend
export const fetchAllStocksApi = async (user) => {
  try {
    const response = await axios.get(`${apiUrl}/stocks`, {
      headers: {
        Authorization: `Token token=${user.token}`,
      },
    });
    console.log("Stocks fetched from API:", response.data.stocks); // Log the stocks here
    return response.data.stocks;
  } catch (error) {
    console.error("Failed to fetch stocks from backend:", error);
    throw error;
  }
};