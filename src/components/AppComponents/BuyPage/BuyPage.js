import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import "./BuyPage.css";

const BuyPage = ({ msgAlert }) => {
  const { stockTicker } = useParams();
  const { getStockPrice, buyingPower, decreaseBuyingPower, addInvestment } =
    useStocks();

  const [buyInType, setBuyInType] = useState("dollars");
  const [limitOrderType, setLimitOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [priceLimit, setPriceLimit] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [shares, setShares] = useState(""); // Track whole-number shares
  const navigate = useNavigate();

  const marketPrice = getStockPrice(stockTicker);

  useEffect(() => {
    if (limitOrderType === "market") {
      setPriceLimit(marketPrice);
    }
  }, [limitOrderType, marketPrice]);

  useEffect(() => {
    if (buyInType === "shares") {
      setShares(Math.floor(amount)); // Ensure only whole number shares are bought
      setTotalAmount((Math.floor(amount) * marketPrice).toFixed(2));
    } else if (buyInType === "dollars" && amount) {
      const calculatedShares = Math.floor(amount / marketPrice);
      setShares(calculatedShares); // Display the whole number shares based on dollar amount
      setTotalAmount((calculatedShares * marketPrice).toFixed(2));
    }
  }, [amount, marketPrice, buyInType]);

  const handleBuy = () => {
    if (!amount || amount <= 0) {
      msgAlert({
        heading: "Invalid Input",
        message: "Please enter a valid amount.",
        variant: "warning",
      });
      return;
    }

    let cost;
    let sharesToBuy;

    // Calculate based on buying mode (dollars or shares)
    if (buyInType === "shares") {
      sharesToBuy = Math.floor(amount); // Round shares to nearest whole
      cost = sharesToBuy * marketPrice;
    } else {
      // Calculate shares to buy with given dollar amount and round down
      sharesToBuy = Math.floor(amount / marketPrice);
      cost = sharesToBuy * marketPrice; // Total cost based on shares that can actually be bought
    }

    // Check if buyingPower is sufficient for the actual cost
    if (cost > buyingPower) {
      msgAlert({
        heading: "Insufficient Funds",
        message: `You do not have enough buying power to purchase ${sharesToBuy} shares of ${stockTicker}.`,
        variant: "danger",
      });
      return;
    }

    // Deduct actual cost from buying power
    decreaseBuyingPower(cost);

    // Add the new investment
    addInvestment({
      name: stockTicker,
      date: new Date().toISOString().split("T")[0],
      shares: sharesToBuy,
      purchasePrice: marketPrice,
      avgCost: marketPrice,
    });

    msgAlert({
      heading: "Buy Confirmation",
      message: `Successfully bought ${sharesToBuy} shares of ${stockTicker} at the market price of $${marketPrice}. Total cost: $${cost}.`,
      variant: "success",
    });

    navigate("/stock-watch");
  };

  return (
    <div className="buy-page-container">
      <h1>Buy {stockTicker}</h1>
      <div className="input-container">
        <label>Buy in:</label>
        <select
          onChange={(e) => setBuyInType(e.target.value)}
          value={buyInType}
        >
          <option value="dollars">Dollars</option>
          <option value="shares">Shares</option>
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

        <label>Amount to Buy ({buyInType}):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Total Amount and Shares Display */}
        {buyInType === "shares" && (
          <>
            <label>Total Amount:</label>
            <input type="text" value={totalAmount} readOnly />
          </>
        )}
        {buyInType === "dollars" && (
          <>
            <label>Shares:</label>
            <input type="text" value={shares} readOnly />
          </>
        )}

        <button className="confirm-btn" onClick={handleBuy}>
          Confirm Buy
        </button>
      </div>
    </div>
  );
};

export default BuyPage;
