import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import { createInvestment } from "../../../api/investmentApi";
import "./BuyPage.css"; // Ensure CSS changes are here

const BuyPage = ({ msgAlert, user }) => {
  const { stockTicker } = useParams();
  const {
    getStockPrice,
    buyingPower,
    decreaseBuyingPower,
    addInvestment,
    updateBuyingPower,
  } = useStocks();
  const [buyInType, setBuyInType] = useState("dollars"); // Choose between buying in dollars or shares
  const [limitOrderType, setLimitOrderType] = useState("market"); // Choose market or limit order
  const [amount, setAmount] = useState(""); // User input for amount to buy in dollars or shares
  const [priceLimit, setPriceLimit] = useState(""); // User-defined price for limit order
  const [totalAmount, setTotalAmount] = useState(""); // Total amount in dollars calculated based on shares or dollar input
  const [shares, setShares] = useState(""); // Calculated shares to buy based on input amount
  const navigate = useNavigate();

  const marketPrice = getStockPrice(stockTicker);

  // Automatically set the price limit to the market price when the order type is market
  useEffect(() => {
    if (limitOrderType === "market") {
      setPriceLimit(marketPrice);
    }
  }, [limitOrderType, marketPrice]);

  // Update total amount and shares based on `buyInType`
  useEffect(() => {
    if (buyInType === "shares") {
      setShares(Math.floor(amount));
      setTotalAmount((Math.floor(amount) * marketPrice).toFixed(2));
    } else if (buyInType === "dollars" && amount) {
      const calculatedShares = Math.floor(amount / marketPrice);
      setShares(calculatedShares);
      setTotalAmount((calculatedShares * marketPrice).toFixed(2));
    }
  }, [amount, marketPrice, buyInType]);

  const handleBuy = async () => {
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

    if (buyInType === "shares") {
      sharesToBuy = Math.floor(amount);
      cost = sharesToBuy * marketPrice;
    } else {
      sharesToBuy = Math.floor(amount / marketPrice);
      cost = sharesToBuy * marketPrice;
    }

    if (cost > buyingPower) {
      msgAlert({
        heading: "Insufficient Funds",
        message: `You do not have enough buying power to purchase ${sharesToBuy} shares of ${stockTicker}.`,
        variant: "danger",
      });
      return;
    }

    // Decrease locally
    decreaseBuyingPower(cost);

    // Sync with backend after local decrease
    await updateBuyingPower(buyingPower - cost);

    const investmentData = {
      userId: user._id,
      stockTicker,
      shares: sharesToBuy,
      purchasePrice: marketPrice,
      avgCost: marketPrice,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await createInvestment(investmentData, user.token);
      addInvestment(investmentData);

      msgAlert({
        heading: "Buy Confirmation",
        message: `Successfully bought ${sharesToBuy} shares of ${stockTicker} at the market price of $${marketPrice}. Total cost: $${cost}.`,
        variant: "success",
      });
      navigate("/stock-watch");
    } catch (error) {
      msgAlert({
        heading: "Transaction Error",
        message: "Could not complete the transaction. Please try again later.",
        variant: "danger",
      });
    }
  };

  const handleCancel = () => {
    msgAlert({
      heading: "Purchase Canceled",
      message: `Purchase action for ${stockTicker} was canceled.`,
      variant: "warning",
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

        {buyInType === "dollars" ? (
          <div className="slide-down visible">
            <label>Amount to Buy (Dollars):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label>Shares:</label>
            <input type="text" value={shares} readOnly />
            <label>Total Amount:</label>
            <input type="text" value={totalAmount} readOnly />
          </div>
        ) : (
          <div className="slide-down visible">
            <label>Amount to Buy (Shares):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label>Total Amount:</label>
            <input type="text" value={totalAmount} readOnly />
          </div>
        )}

        <button className="confirm-btn" onClick={handleBuy}>
          Confirm Buy
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyPage;
