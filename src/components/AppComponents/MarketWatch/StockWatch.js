import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StockWatch.css";

const API_KEY = "BK715QRUZE5GRMG7"; // Replace with your actual API key
const STOCK_SYMBOLS = [
  "AAPL",
  "GOOGL",
  "AMZN",
  "MSFT",
  "TSLA",
  "NVDA",
  "PFE",
  "NFLX",
  "GE",
  "META",
  "DIS",
];

const StockWatch = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch stock data
  const fetchStockData = async () => {
    try {
      const stockData = await Promise.all(
        STOCK_SYMBOLS.map(async (symbol) => {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
          );

          if (
            response.data["Time Series (Daily)"] &&
            response.data["Meta Data"]
          ) {
            const timeSeries = response.data["Time Series (Daily)"];
            const lastRefreshed =
              response.data["Meta Data"]["3. Last Refreshed"];
            const currentPrice = timeSeries[lastRefreshed]["1. open"];
            return { symbol, price: currentPrice };
          } else {
            console.error(`No valid data for ${symbol}`);
            return { symbol, price: "N/A" };
          }
        })
      );
      setStocks(stockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data", error);
    }
  };

  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 24 * 60 * 60 * 1000); // Fetch data every 24 hours
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div className="stock-watch-container">
      <h1>Stock Market Watch</h1>
      {loading ? (
        <p>Loading stocks...</p>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Stock Symbol</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.price}</td>
                <td className="actions-column">
                  <div className="action-btn">
                    <button className="stock-btn buy-btn">Buy</button>
                    <button className="stock-btn sell-btn">Sell</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockWatch;
