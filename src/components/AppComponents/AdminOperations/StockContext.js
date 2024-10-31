// StockContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchAllStocksApi } from "../../../api/stockApi";
import { fetchMarketScheduleApi } from "../../../api/marketScheduleApi";
import { fetchInvestments } from "../../../api/investmentApi";
import { getBankInfo } from "../../../api/accountApi"; // API to fetch bank info

import {
  fetchBuyingPower,
  updateBuyingPower as updateBuyingPowerApi,
  createBuyingPower,
} from "../../../api/buyingPowerApi";

const StockContext = createContext();

// Function to apply random fluctuation (define this above StockProvider)
const applyRandomPriceChange = (stock) => {
  const fluctuationPercentage = Math.random() * 0.02 - 0.01; // Range: -1% to +1%
  const newPrice = stock.initialPrice * (1 + fluctuationPercentage);
  const priceChange = newPrice - stock.initialPrice;
  const changePercent = (priceChange / stock.initialPrice) * 100;

  return {
    ...stock,
    initialPrice: newPrice,
    change: priceChange,
    changePercent,
  };
};

export const StockProvider = ({ children, user }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketSchedule, setMarketSchedule] = useState(null);
  const [buyingPower, setBuyingPower] = useState(10000); // Default initial buying power
  const [bankInfo, setBankInfo] = useState(null);
  const [investments, setInvestments] = useState([]);

  // Add stock to the local state
  const addStock = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
  };

  const increaseBuyingPower = (amount) =>
    setBuyingPower((prev) => prev + amount);
  const decreaseBuyingPower = (amount) =>
    setBuyingPower((prev) => Math.max(0, prev - amount));

  // Update buying power in both frontend and backend
  const updateBuyingPower = async (newAmount) => {
    try {
      if (user) {
        await updateBuyingPowerApi(user, newAmount);
        setBuyingPower(newAmount);
      }
    } catch (error) {
      console.error("Failed to update buying power:", error);
    }
  };

  // Create initial buying power if it doesn't exist
  const createInitialBuyingPower = async () => {
    try {
      if (user) {
        const initialBuyingPower = await createBuyingPower(user);
        setBuyingPower(initialBuyingPower);
      }
    } catch (error) {
      console.error("Failed to create initial buying power:", error);
    }
  };

  const addInvestment = (newInvestment) => {
    setInvestments((prevInvestments) => {
      const existingInvestment = prevInvestments.find(
        (inv) => inv.stockTicker === newInvestment.stockTicker
      );

      if (existingInvestment) {
        const totalShares = existingInvestment.shares + newInvestment.shares;
        const avgCost = (
          (existingInvestment.shares * existingInvestment.avgCost +
            newInvestment.shares * newInvestment.purchasePrice) /
          totalShares
        ).toFixed(2);

        return prevInvestments.map((inv) =>
          inv.stockTicker === newInvestment.stockTicker
            ? { ...inv, shares: totalShares, avgCost: parseFloat(avgCost) }
            : inv
        );
      }

      return [...prevInvestments, newInvestment];
    });
  };

  const sellStock = (stockTicker, sharesToSell, price) => {
    setInvestments((prevInvestments) =>
      prevInvestments
        .map((stock) => {
          if (stock.stockTicker === stockTicker) {
            const remainingShares = stock.shares - sharesToSell;
            return remainingShares > 0
              ? { ...stock, shares: remainingShares }
              : null;
          }
          return stock;
        })
        .filter(Boolean)
    );

    setBuyingPower((prevBuyingPower) => prevBuyingPower + sharesToSell * price);
  };

  useEffect(() => {
    const fetchBankInfo = async () => {
      if (user && user.token) {
        try {
          const data = await getBankInfo(user.token); // Fetch bank info from the server
          setBankInfo(data); // Store it in context
        } catch (error) {
          console.error("Failed to fetch bank info:", error);
        }
      }
    };
    fetchBankInfo();
  }, [user]);

  const updateBankInfo = (info) => setBankInfo(info);

  // Fetch user's buying power from backend
  const fetchUserBuyingPower = async () => {
    try {
      if (user) {
        const userBuyingPower = await fetchBuyingPower(user);

        setBuyingPower(userBuyingPower);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await createInitialBuyingPower();
      } else {
        console.error("Failed to fetch buying power:", error);
        setError("Failed to fetch buying power.");
      }
    }
  };

  // Fetch investments specific to the user
  const fetchUserInvestments = async () => {
    try {
      if (user) {
        const userInvestments = await fetchInvestments(user);

        const mergedInvestments = userInvestments.reduce((acc, investment) => {
          const existing = acc.find(
            (inv) => inv.stockTicker === investment.stockTicker
          );
          if (existing) {
            const totalShares = existing.shares + investment.shares;
            const avgCost = (
              (existing.shares * existing.avgCost +
                investment.shares * investment.purchasePrice) /
              totalShares
            ).toFixed(2);
            existing.shares = totalShares;
            existing.avgCost = parseFloat(avgCost);
          } else {
            acc.push(investment);
          }
          return acc;
        }, []);

        setInvestments(mergedInvestments);
      }
    } catch (error) {
      console.error("Failed to fetch investments for user:", error);
      setError("Failed to fetch investments.");
    }
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
    const intervalId = setInterval(() => {
      setStocks((prevStocks) => {
        const updatedStocks = prevStocks.map((stock) =>
          stock.randomPriceGenerator === "yes"
            ? applyRandomPriceChange(stock)
            : stock
        );
        return updatedStocks;
      });
    }, 5000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [setStocks]);

  // Fetch user-specific data on login, and reset on logout
  useEffect(() => {
    if (user) {
      fetchAllStocks();
      fetchMarketSchedule();
      fetchUserInvestments();
      fetchUserBuyingPower();
    } else {
      setStocks([]);
      setMarketSchedule(null);
      setInvestments([]);
      setBuyingPower(0);
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
        updateBuyingPower,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

// Custom hook to use the StockContext
export const useStocks = () => useContext(StockContext);
