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
  // Pre-fill the stock state with symbols and N/A prices
  const [stocks, setStocks] = useState(
    STOCK_SYMBOLS.map((symbol) => ({
      symbol,
      price: "N/A",
      previousPrice: "N/A",
    }))
  );
  const [loading, setLoading] = useState(true);
  const [marketClosed, setMarketClosed] = useState(false);

  // Helper to check if the market is currently open (9:30 AM to 4:00 PM ET)
  const isMarketOpen = () => {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentDay = now.getUTCDay();

    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isInMarketHours = currentHour >= 13 && currentHour < 21;

    return isWeekday && isInMarketHours;
  };

  // Function to fetch stock data
  const fetchStockData = async () => {
    if (!isMarketOpen()) {
      console.log("Market is closed, skipping data fetch.");
      setMarketClosed(true); // Set the marketClosed state to true
      setLoading(false); // Stop showing loading spinner
      return;
    }

    try {
      const stockData = await Promise.all(
        STOCK_SYMBOLS.map(async (symbol) => {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
          );

          if (
            response.data["Time Series (5min)"] &&
            response.data["Meta Data"]
          ) {
            const timeSeries = response.data["Time Series (5min)"];
            const lastRefreshed =
              response.data["Meta Data"]["3. Last Refreshed"];
            const currentPrice = timeSeries[lastRefreshed]["1. open"];

            return { symbol, price: currentPrice, previousPrice: "N/A" }; // Update stock with current price
          } else {
            console.error(`No valid data for ${symbol}`);
            return { symbol, price: "N/A", previousPrice: "N/A" };
          }
        })
      );

      setStocks(stockData); // Update stock data with API results
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data", error);
    }
  };

  useEffect(() => {
    fetchStockData(); // Fetch data initially

    const intervalId = setInterval(fetchStockData, 10 * 60 * 1000); // Fetch data every 10 minutes

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []); // Empty dependencies so it only runs on mount

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.price}</td>
                  <td>
                    {/* Always display N/A when the market is closed */}
                    {marketClosed ? (
                      "-"
                    ) : stock.price > stock.previousPrice ? (
                      <span className="up-arrow">&#9650;</span> // Up arrow symbol
                    ) : stock.price < stock.previousPrice ? (
                      <span className="down-arrow">&#9660;</span> // Down arrow symbol
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
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StockWatch;
