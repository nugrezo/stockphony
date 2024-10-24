import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchAllStocksApi } from "../../../api/stockApi"; // Import the fetch API

// Create the StockContext
const StockContext = createContext();

// StockProvider to manage the global stock state
export const StockProvider = ({ children, user }) => {
  // Pass user here
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addStock = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
  };

  // Fetch all stocks (backend + any other sources like APIs)
  const fetchAllStocks = async () => {
    try {
      if (user) {
        // Only fetch if user exists
        setLoading(true);
        const backendStocks = await fetchAllStocksApi(user); // Pass the entire user object
        setStocks(backendStocks);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch all stocks:", err);
      setError("Failed to fetch all stocks.");
      setLoading(false);
    }
  };

  // Fetch all stocks when the user is signed in
  useEffect(() => {
    if (user) {
      fetchAllStocks();
    }
  }, [user]);

  return (
    <StockContext.Provider
      value={{ stocks, loading, error, fetchAllStocks, addStock }}
    >
      {children}
    </StockContext.Provider>
  );
};

// Custom hook to use the StockContext
export const useStocks = () => {
  return useContext(StockContext);
};
