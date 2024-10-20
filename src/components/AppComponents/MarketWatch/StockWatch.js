import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StockWatch.css";

// Use your Finnhub API key
const FINNHUB_API_KEY = "csa9d79r01qsm2oanoc0csa9d79r01qsm2oanocg";

const StockWatch = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketClosed, setMarketClosed] = useState(false);

  const isMarketOpen = () => {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentDay = now.getUTCDay();

    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isInMarketHours = currentHour >= 13 && currentHour < 21;

    return isWeekday && isInMarketHours;
  };

  const fetchStockData = async () => {
    if (!isMarketOpen()) {
      console.log("Market is closed, fetching last available data.");
      setMarketClosed(true);
    } else {
      setMarketClosed(false);
    }

    const stocksToFetch = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]; // Add your desired stocks

    try {
      const stockDataPromises = stocksToFetch.map((symbol) => {
        return axios.get("https://finnhub.io/api/v1/quote", {
          params: { symbol, token: FINNHUB_API_KEY },
        });
      });

      const stockDataResponses = await Promise.all(stockDataPromises);
      const stockData = stockDataResponses.map((response, index) => {
        const data = response.data;
        return {
          symbol: stocksToFetch[index],
          price: data.c, // Current price
          dayHigh: data.h, // High price
          dayLow: data.l, // Low price
          change: data.d, // Change from previous close
          changePercent: data.dp, // Change percentage
        };
      });

      setStocks(stockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const stockRows = stocks.map((stock) => {
    const changeClass =
      stock.change > 0 ? "flash-green" : stock.change < 0 ? "flash-red" : "";

    return (
      <tr key={stock.symbol}>
        <td>
          <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
        </td>
        <td>{stock.price ? `$${stock.price.toFixed(2)}` : "N/A"}</td>
        <td className={changeClass}>
          {stock.change ? `$${stock.change.toFixed(2)}` : "N/A"}
        </td>
        <td>
          {stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : "N/A"}
        </td>
        <td>{stock.dayHigh ? `$${stock.dayHigh.toFixed(2)}` : "N/A"}</td>
        <td>{stock.dayLow ? `$${stock.dayLow.toFixed(2)}` : "N/A"}</td>
        <td>
          {marketClosed ? (
            "-"
          ) : stock.change > 0 ? (
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
      {loading ? (
        <p>Loading stocks...</p>
      ) : (
        <>
          {marketClosed && (
            <p>
              The market is closed, data will be updated when the market opens.
            </p>
          )}
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
        </>
      )}
    </div>
  );
};

export default StockWatch;
