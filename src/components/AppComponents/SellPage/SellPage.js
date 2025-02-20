import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import { updateInvestment } from "../../../api/investmentApi"; // Ensure this is correct
import { createTransaction } from "../../../api/transactionsHistoryApi"; // Import transaction API

import "./SellPage.css";

const SellPage = ({ msgAlert, user }) => {
  const { stockTicker } = useParams();
  const {
    getStockPrice,
    sellStock,
    investments,
    buyingPower,
    updateBuyingPower,
  } = useStocks();
  const [sellInType, setSellInType] = useState("shares");
  const [limitOrderType, setLimitOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [priceLimit, setPriceLimit] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [sharesToSell, setSharesToSell] = useState("");
  const navigate = useNavigate();

  const marketPrice = getStockPrice(stockTicker);

  const investment = investments.find((inv) => inv.stockTicker === stockTicker);
  const ownedShares = investment?.shares || 0;

  useEffect(() => {
    if (limitOrderType === "market") {
      setPriceLimit(marketPrice);
    }
  }, [limitOrderType, marketPrice]);

  useEffect(() => {
    if (sellInType === "shares") {
      setSharesToSell(Math.floor(amount));
      setTotalAmount((Math.floor(amount) * marketPrice).toFixed(2));
    } else if (sellInType === "dollars" && amount) {
      const calculatedShares = Math.floor(amount / marketPrice);
      setSharesToSell(calculatedShares);
      setTotalAmount((calculatedShares * marketPrice).toFixed(2));
    }
  }, [amount, marketPrice, sellInType]);

  const handleSell = async () => {
    if (
      !amount ||
      parseFloat(amount) <= 0 ||
      parseFloat(amount) > ownedShares
    ) {
      msgAlert({
        heading: "Invalid Input",
        message: `You only have ${ownedShares} shares of ${stockTicker} to sell.`,
        variant: "warning",
      });
      return;
    }

    const sharesSold =
      sellInType === "shares"
        ? Math.floor(amount)
        : Math.floor(amount / marketPrice);
    const sellAmount = sharesSold * marketPrice;

    const investmentData = {
      stockTicker,
      sharesToSell: sharesSold,
      sellPrice: marketPrice,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await updateInvestment(investmentData, user); // Update the backend
      sellStock(stockTicker, sharesSold, marketPrice); // Update in local state
      await updateBuyingPower(buyingPower + sellAmount); // Sync with backend

      // Log the sell transaction
      const transactionData = {
        transactionType: "sell",
        stockTicker,
        amount: -sellAmount, // Negative for sell
        shares: sharesSold,
        pricePerShare: marketPrice, // Include pricePerShare for the transaction
      };
      await createTransaction(user, transactionData);

      msgAlert({
        heading: "Sell Confirmation",
        message: `Successfully sold ${sharesSold} shares of ${stockTicker} at $${marketPrice}. Total: $${sellAmount}.`,
        variant: "success",
      });
      navigate("/stock-watch");
    } catch (error) {
      msgAlert({
        heading: "Transaction Error",
        message: "Could not complete the sale. Please try again later.",
        variant: "danger",
      });
    }
  };

  const handleCancel = () => {
    msgAlert({
      heading: "Sell Canceled",
      message: `Sell action for ${stockTicker} was canceled.`,
      variant: "warning",
    });
    navigate("/stock-watch");
  };

  return (
    <div className="sell-page-container">
      <h1>Sell {stockTicker}</h1>
      <div className="input-container">
        <label>Sell in:</label>
        <select
          onChange={(e) => setSellInType(e.target.value)}
          value={sellInType}
        >
          <option value="shares">Shares</option>
          <option value="dollars">Dollars</option>
        </select>

        <label>Limit Order:</label>
        <select
          onChange={(e) => setLimitOrderType(e.target.value)}
          value={limitOrderType}
        >
          <option value="market">Market Price</option>
          <option value="limit">Set Price Limit</option>
        </select>

        <label>Market Price:</label>
        <input type="number" value={marketPrice} readOnly />

        {limitOrderType === "limit" && (
          <>
            <label>Set Price Limit:</label>
            <input
              type="number"
              value={priceLimit}
              onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
            />
          </>
        )}

        {sellInType === "dollars" ? (
          <div className="slide-down visible-sell">
            <label>Amount to Sell (Dollars):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label>Shares:</label>
            <input type="text" value={sharesToSell} readOnly />
            <label>Total Amount:</label>
            <input type="text" value={totalAmount} readOnly />
          </div>
        ) : (
          <div className="slide-down visible-sell">
            <label>Amount to Sell (Shares):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label>Total Amount:</label>
            <input type="text" value={totalAmount} readOnly />
          </div>
        )}

        <button className="confirm-btn" onClick={handleSell}>
          Confirm Sell
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SellPage;
