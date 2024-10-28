/* eslint-disable indent */
import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchAllStocksApi } from "../../../api/stockApi";
import { fetchMarketScheduleApi } from "../../../api/marketScheduleApi";

const StockContext = createContext();

export const StockProvider = ({ children, user }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketSchedule, setMarketSchedule] = useState(null);
  const [buyingPower, setBuyingPower] = useState(10000); // Initial buying power, can be set dynamically
  const [bankInfo, setBankInfo] = useState(null);
  const [investments, setInvestments] = useState([]); // State for holding investments

  const addStock = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
  };

  const increaseBuyingPower = (amount) => {
    setBuyingPower((prev) => prev + amount);
  };

  const decreaseBuyingPower = (amount) => {
    setBuyingPower((prev) => Math.max(0, prev - amount));
  };

  const addInvestment = (newInvestment) => {
    setInvestments((prevInvestments) => {
      // Check if investment already exists for the same stock
      const existingInvestment = prevInvestments.find(
        (inv) => inv.name === newInvestment.name
      );

      if (existingInvestment) {
        // Update the investment by averaging the cost and updating shares
        const totalShares =
          parseFloat(existingInvestment.shares) +
          parseFloat(newInvestment.shares);
        const avgCost = (
          (existingInvestment.shares * existingInvestment.avgCost +
            newInvestment.shares * newInvestment.purchasePrice) /
          totalShares
        ).toFixed(2); // Keep 2 decimal places

        // Return updated investments
        return prevInvestments.map((inv) =>
          inv.name === newInvestment.name
            ? { ...inv, shares: totalShares, avgCost: parseFloat(avgCost) }
            : inv
        );
      }

      // Add new investment if it doesn't exist
      return [
        ...prevInvestments,
        { ...newInvestment, avgCost: newInvestment.purchasePrice },
      ];
    });
  };

  const sellStock = (stockTicker, sharesToSell, price) => {
    setInvestments(
      (prevInvestments) =>
        prevInvestments
          .map((stock) => {
            if (stock.name === stockTicker) {
              const remainingShares = stock.shares - sharesToSell;
              return remainingShares > 0
                ? { ...stock, shares: remainingShares }
                : null;
            }
            return stock;
          })
          .filter(Boolean) // Remove stocks with 0 shares
    );

    setBuyingPower((prevBuyingPower) => prevBuyingPower + sharesToSell * price);
  };

  const updateBankInfo = (info) => {
    setBankInfo(info);
  };

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

  const fetchMarketSchedule = async () => {
    try {
      if (user) {
        const schedule = await fetchMarketScheduleApi(user);
        setMarketSchedule(schedule);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch market schedule:", err);
      setError("Failed to fetch market schedule.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllStocks();
      fetchMarketSchedule();
    }
  }, [user]);

  const getStockPrice = (stockTicker) => {
    const stock = stocks.find((s) => s.stockTicker === stockTicker);
    return stock ? stock.initialPrice : null;
  };

  return (
    <StockContext.Provider
      value={{
        user,
        stocks,
        loading,
        error,
        marketSchedule,
        buyingPower,
        bankInfo,
        investments,
        updateBankInfo,
        fetchAllStocks,
        fetchMarketSchedule,
        addStock,
        increaseBuyingPower,
        decreaseBuyingPower,
        addInvestment,
        getStockPrice,
        sellStock,
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
