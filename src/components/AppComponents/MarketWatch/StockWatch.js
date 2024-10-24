import React from "react";
import { Link } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import "./StockWatch.css";

const StockWatch = () => {
  const { stocks, loading, error, marketSchedule } = useStocks(); // Get stocks and market schedule from the context

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  // If no market schedule is set, treat the market as closed (no fallback to default times)
  const openTime = marketSchedule?.openTime || null;
  const closeTime = marketSchedule?.closeTime || null;
  const holidays = marketSchedule?.holidays || [];

  // Get current time in 'America/New_York' timezone in 'HH:mm' format
  const currentTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  // Debugging: Log the current time and open/close times
  console.log("Current Time:", currentTime); // Log current time for debugging
  console.log("Market Open Time:", openTime); // Log market open time
  console.log("Market Close Time:", closeTime); // Log market close time

  // Handle whether today is a holiday
  const isHoliday = holidays.includes(today);

  // Handle market open/close logic, including cases when the market closes after midnight
  let isMarketOpen = false;
  let marketMessage = "";

  if (!openTime || !closeTime) {
    // If there is no open or close time set by admin, consider the market as closed
    marketMessage = "The market schedule has not been set by the admin.";
  } else {
    // Check if the market schedule spans over midnight
    const crossesMidnight = openTime > closeTime;

    if (crossesMidnight) {
      // Market is open if the current time is after the openTime or before the closeTime (spanning midnight)
      isMarketOpen =
        (currentTime >= openTime && currentTime <= "23:59") ||
        (currentTime >= "00:00" && currentTime <= closeTime);
    } else {
      // Regular market hours
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

  // Handle loading and error states
  if (loading) {
    return <p>Loading stocks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Render stock data
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
            <button className="stock-btn buy-btn">Buy</button>
            <button className="stock-btn sell-btn">Sell</button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="stock-watch-container">
      <h1>Stock Market Watch</h1>
      <p>{marketMessage}</p> {/* Display market open/close/holiday messages */}
      {/* Show table only if the market is open and it's not a holiday */}
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
