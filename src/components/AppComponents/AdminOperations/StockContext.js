import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchAllStocksApi } from "../../../api/stockApi";
import { fetchMarketScheduleApi } from "../../../api/marketScheduleApi"; // Import the fetch API for market schedule

// Create the StockContext
const StockContext = createContext();

// StockProvider to manage the global stock and market schedule state
export const StockProvider = ({ children, user }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketSchedule, setMarketSchedule] = useState(null); // Add market schedule state
  const [buyingPower, setBuyingPower] = useState(0); // New buying power state
  const [bankInfo, setBankInfo] = useState(null);

  const addStock = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
  };

  const increaseBuyingPower = (amount) => {
    setBuyingPower((prev) => prev + amount);
  };

  const decreaseBuyingPower = (amount) => {
    setBuyingPower((prev) => Math.max(0, prev - amount));
  };

  const updateBankInfo = (info) => {
    setBankInfo(info);
  };

  // Fetch all stocks (backend + any other sources like APIs)
  const fetchAllStocks = async () => {
    try {
      if (user) {
        setLoading(true);
        const backendStocks = await fetchAllStocksApi(user);
        setStocks(backendStocks);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch all stocks:", err);
      setError("Failed to fetch all stocks.");
      setLoading(false);
    }
  };

  // Fetch market schedule (admin-configured)
  const fetchMarketSchedule = async () => {
    try {
      if (user) {
        console.log("Fetching market schedule..."); // Log to track function call
        const schedule = await fetchMarketScheduleApi(user); // Fetch schedule from the API
        setMarketSchedule(schedule);
        setError(null);
        console.log("Fetched Market Schedule:", schedule);
      }
    } catch (err) {
      console.error("Failed to fetch market schedule:", err);
      setError("Failed to fetch market schedule.");
    }
  };

  // Fetch all stocks and market schedule when the user is signed in
  useEffect(() => {
    if (user) {
      fetchAllStocks();
      fetchMarketSchedule(); // Fetch the market schedule when the user is logged in
    }
  }, [user]);

  return (
    <StockContext.Provider
      value={{
        user,
        stocks,
        loading,
        error,
        marketSchedule, // Pass market schedule to context
        buyingPower, // Provide buying power in context
        bankInfo,
        updateBankInfo,
        fetchAllStocks,
        fetchMarketSchedule,
        addStock,
        increaseBuyingPower, // Provide functions to adjust buying power
        decreaseBuyingPower,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

// Custom hook to use the StockContext
export const useStocks = () => {
  return useContext(StockContext);
};
