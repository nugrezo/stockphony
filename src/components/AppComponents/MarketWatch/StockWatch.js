import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StockWatch.css";

// Replace with your actual RapidAPI key
const RAPIDAPI_KEY = "34ebffca19msh856070ba16f9837p18b350jsn8d23f09aa127";

const StockWatch = () => {
  // Pre-fill the stock state with symbols and N/A prices
  const [stocks, setStocks] = useState([]);
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

  // Function to fetch stock data from Yahoo Finance API
  const fetchStockData = async () => {
    if (!isMarketOpen()) {
      console.log("Market is closed, skipping data fetch.");
      setMarketClosed(true); // Set the marketClosed state to true
      setLoading(false); // Stop showing loading spinner
      return;
    }

    setMarketClosed(false); // Market is open

    const options = {
      method: "GET",
      url: "https://yahoo-finance-api-data.p.rapidapi.com/search/list-detail",
      params: {
        id: "a4f8a58b-e458-44fe-b304-04af382a364e", // Correct id
        limit: "10",
        offset: "0",
      },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "yahoo-finance-api-data.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("Full Response Data:", response.data);
      console.log("Data Array:", response.data.data);

      if (
        response.data &&
        response.data.data &&
        response.data.data[0] &&
        response.data.data[0].quotes
      ) {
        const stockData = response.data.data[0].quotes.map((stock) => ({
          symbol: stock.symbol,
          price: stock.regularMarketPrice,
          previousPrice: stock.regularMarketPreviousClose,
          change: stock.regularMarketChange, // New Column: Change
          changePercent: stock.regularMarketChangePercent, // New Column: % Change
          dayHigh: stock.regularMarketDayHigh, // New Column: Day High
          dayLow: stock.regularMarketDayLow, // New Column: Day Low
          marketCap: stock.marketCap, // New Column: Market Cap
        }));

        setStocks(stockData); // Update stock data with API results
      } else {
        console.error("No valid data in the API response");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data", error);
      setLoading(false);
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
                <th>% Change</th>
                <th>Day High</th>
                <th>Day Low</th>
                <th>Market Cap</th>
                <th>Change Indicator</th> {/* New Column for Arrows */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.price ? `$${stock.price.toFixed(2)}` : "N/A"}</td>
                  <td>
                    {stock.change ? `$${stock.change.toFixed(2)}` : "N/A"}
                  </td>
                  <td>
                    {stock.changePercent
                      ? `${stock.changePercent.toFixed(2)}%`
                      : "N/A"}
                  </td>
                  <td>
                    {stock.dayHigh ? `$${stock.dayHigh.toFixed(2)}` : "N/A"}
                  </td>
                  <td>
                    {stock.dayLow ? `$${stock.dayLow.toFixed(2)}` : "N/A"}
                  </td>
                  <td>
                    {stock.marketCap
                      ? `$${(stock.marketCap / 1e9).toFixed(2)}B`
                      : "N/A"}
                  </td>

                  {/* Arrow Logic: Showing Up/Down Arrows */}
                  <td>
                    {marketClosed ? (
                      "-"
                    ) : stock.price > stock.previousPrice ? (
                      <span className="up-arrow">&#9650;</span> // Up arrow
                    ) : stock.price < stock.previousPrice ? (
                      <span className="down-arrow">&#9660;</span> // Down arrow
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
