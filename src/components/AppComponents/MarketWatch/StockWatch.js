// StockWatch.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import "./StockWatch.css";

const StockWatch = () => {
  const { stocks, loading, error, marketSchedule } = useStocks();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const currentDay = new Date().getDay(); // 0: Sunday, 6: Saturday
  const openTime = marketSchedule?.openTime || null;
  const closeTime = marketSchedule?.closeTime || null;
  const holidays = marketSchedule?.holidays || [];

  const currentTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const isWeekend = currentDay === 0 || currentDay === 6; // Check if it's Saturday or Sunday
  const isHoliday = holidays.includes(today); // Check if today is a holiday
  let isMarketOpen = false;
  let marketMessage = "";

  // Check if market should be closed by default (weekends or holidays)
  if (isWeekend || isHoliday) {
    marketMessage = isWeekend
      ? "The market is closed on weekends."
      : "The market is closed today due to a holiday.";
  } else if (!openTime || !closeTime) {
    marketMessage = "The market schedule has not been set by the admin.";
  } else {
    // Check if market is open based on admin-set hours
    const crossesMidnight = openTime > closeTime;
    if (crossesMidnight) {
      isMarketOpen =
        (currentTime >= openTime && currentTime <= "23:59") ||
        (currentTime >= "00:00" && currentTime <= closeTime);
    } else {
      isMarketOpen = currentTime >= openTime && currentTime <= closeTime;
    }

    marketMessage = isMarketOpen
      ? `The market is currently open and will close at ${closeTime} (local time).`
      : `The market is currently closed. It will open at ${openTime} (local time).`;
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
              disabled={!isMarketOpen}
            >
              Buy
            </button>
            <button
              className="stock-btn sell-btn"
              onClick={() => handleNavigate("sell", stock)}
              disabled={!isMarketOpen}
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
      {isMarketOpen && !isWeekend && !isHoliday && (
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
