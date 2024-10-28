// StockWatch.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import "./StockWatch.css";

const StockWatch = () => {
  const { stocks, loading, error, marketSchedule } = useStocks();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const openTime = marketSchedule?.openTime || null;
  const closeTime = marketSchedule?.closeTime || null;
  const holidays = marketSchedule?.holidays || [];

  const currentTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const isHoliday = holidays.includes(today);
  let isMarketOpen = false;
  let marketMessage = "";

  if (!openTime || !closeTime) {
    marketMessage = "The market schedule has not been set by the admin.";
  } else {
    const crossesMidnight = openTime > closeTime;
    if (crossesMidnight) {
      isMarketOpen =
        (currentTime >= openTime && currentTime <= "23:59") ||
        (currentTime >= "00:00" && currentTime <= closeTime);
    } else {
      isMarketOpen = currentTime >= openTime && currentTime <= closeTime;
    }

    if (isHoliday) {
      marketMessage = "The market is closed today due to a holiday.";
    } else if (!isMarketOpen) {
      marketMessage = `The market is currently closed. It will open at ${openTime} (local time).`;
    } else {
      marketMessage = `The market is currently open and will close at ${closeTime} (local time).`;
    }
  }

  const handleNavigate = (type, stock) => {
    const path =
      type === "buy"
        ? `/buy/${stock.stockTicker}`
        : `/sell/${stock.stockTicker}`;
    navigate(path);
  };

  if (loading) return <p>Loading stocks...</p>;
  if (error) return <p>{error}</p>;

  const stockRows = stocks.map((stock) => {
    const changeClass =
      stock.change > 0 ? "flash-green" : stock.change < 0 ? "flash-red" : "";

    return (
      <tr key={stock._id}>
        <td>
          <Link to={`/stocks/${stock.stockTicker}`}>{stock.stockTicker}</Link>
        </td>
        <td>
          {stock.initialPrice ? `$${stock.initialPrice.toFixed(2)}` : "N/A"}
        </td>
        <td className={changeClass}>
          {stock.change ? `$${stock.change.toFixed(2)}` : "N/A"}
        </td>
        <td>
          {stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : "N/A"}
        </td>
        <td>{stock.dayHigh ? `$${stock.dayHigh.toFixed(2)}` : "N/A"}</td>
        <td>{stock.dayLow ? `$${stock.dayLow.toFixed(2)}` : "N/A"}</td>
        <td>
          {stock.change > 0 ? (
            <span className="up-arrow">&#9650;</span>
          ) : stock.change < 0 ? (
            <span className="down-arrow">&#9660;</span>
          ) : (
            "-"
          )}
        </td>
        <td className="actions-column">
          <div className="actions-btn">
            <button
              className="stock-btn buy-btn"
              onClick={() => handleNavigate("buy", stock)}
            >
              Buy
            </button>
            <button
              className="stock-btn sell-btn"
              onClick={() => handleNavigate("sell", stock)}
            >
              Sell
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="stock-watch-container">
      <h1>Stock Market Watch</h1>
      <p>{marketMessage}</p>
      {isMarketOpen && !isHoliday && (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Stock Symbol</th>
              <th>Price</th>
              <th>Change</th>
              <th>% Change</th>
              <th>Day High</th>
              <th>Day Low</th>
              <th>Change Indicator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{stockRows}</tbody>
        </table>
      )}
    </div>
  );
};

export default StockWatch;
