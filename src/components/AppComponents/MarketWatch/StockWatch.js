import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StockWatch.css";

// Replace with your actual RapidAPI key
const RAPIDAPI_KEY = "ab82c2d418msh930303db1916df5p195d71jsn14f6a800ea84";

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

    const options = {
      method: "GET",
      url: "https://yahoo-finance-api-data.p.rapidapi.com/search/list-detail",
      params: {
        id: "a4f8a58b-e458-44fe-b304-04af382a364e",
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
          change: stock.regularMarketChange,
          changePercent: stock.regularMarketChangePercent,
          dayHigh: stock.regularMarketDayHigh,
          dayLow: stock.regularMarketDayLow,
          marketCap: stock.marketCap,
        }));

        setStocks(stockData);
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
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 60 * 60 * 1000);

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
          {stock.marketCap ? `$${(stock.marketCap / 1e9).toFixed(2)}B` : "N/A"}
        </td>
        <td>
          {marketClosed ? (
            "-"
          ) : stock.price > stock.previousPrice ? (
            <span className="up-arrow">&#9650;</span>
          ) : stock.price < stock.previousPrice ? (
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
                <th>Market Cap</th>
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
