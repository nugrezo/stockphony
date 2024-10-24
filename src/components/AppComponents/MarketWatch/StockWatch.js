import React from "react";
import { Link } from "react-router-dom";
import { useStocks } from "../AdminOperations/StockContext";
import "./StockWatch.css";

const StockWatch = () => {
  const { stocks, loading, error } = useStocks(); // Get stocks from the context

  if (loading) {
    return <p>Loading stocks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const stockRows = stocks.map((stock) => {
    console.log(stock); // This will log each stock object

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
    </div>
  );
};

export default StockWatch;
