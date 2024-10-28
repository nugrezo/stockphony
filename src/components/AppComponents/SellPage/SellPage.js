import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import "./SellPage.css";

const SellPage = ({ msgAlert }) => {
  const { stockTicker } = useParams();
  const { getStockPrice, sellStock, investments } = useStocks();
  const [sellInType, setSellInType] = useState("shares");
  const [limitOrderType, setLimitOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [priceLimit, setPriceLimit] = useState("");
  const navigate = useNavigate();

  const marketPrice = getStockPrice(stockTicker);

  const ownedShares =
    investments.find((inv) => inv.name === stockTicker)?.shares || 0;

  useEffect(() => {
    if (limitOrderType === "market") {
      setPriceLimit(marketPrice);
    }
  }, [limitOrderType, marketPrice]);

  const handleSell = () => {
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

    sellStock(
      stockTicker,
      parseFloat(amount),
      limitOrderType === "market" ? marketPrice : parseFloat(priceLimit)
    );

    msgAlert({
      heading: "Sell Confirmation",
      message: `Successfully sold ${amount} shares of ${stockTicker}.`,
      variant: "success",
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
              onChange={(e) => setPriceLimit(e.target.value)}
            />
          </>
        )}

        <label>Amount to Sell ({sellInType}):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="confirm-btn" onClick={handleSell}>
          Confirm Sell
        </button>
      </div>
    </div>
  );
};

export default SellPage;
