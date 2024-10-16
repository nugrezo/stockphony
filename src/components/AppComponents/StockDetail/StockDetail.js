/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StockDetail.css";
import StockGraph from "../StockGraph/StockGraph";

const RAPIDAPI_KEY = "42b8a3f448msh52f478828a02e41p1d326ajsn880f471afcec";

const StockDetail = () => {
  const { symbol } = useParams(); // Get stock symbol from the URL
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
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

        const response = await axios.request(options);

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data[0].quotes)
        ) {
          const companyInfo = response.data.data[0].quotes.find(
            (quote) => quote.symbol === symbol
          );
          if (companyInfo) {
            setCompanyData(companyInfo); // Save the company info to state
          } else {
            console.error("No matching company found for the provided symbol.");
          }
        }

        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching company profile:", error);
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [symbol]);

  return (
    <div className="stock-detail-container">
      {loading ? (
        <div className="loading-placeholder">Loading company profile...</div>
      ) : (
        companyData && (
          <>
            {/* Left half: Stock details */}
            <div className="stock-details">
              <h1>
                {companyData.longName ||
                  companyData.symbol ||
                  "Company Name Not Available"}{" "}
                Company Profile
              </h1>

              {/* Table for stock details */}
              <table className="stock-table">
                <tbody>
                  <tr>
                    <th>Symbol:</th>
                    <td>{companyData.symbol || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Market Cap:</th>
                    <td>
                      {companyData.marketCap
                        ? `$${(companyData.marketCap / 1e9).toFixed(2)}B`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Stock Price:</th>
                    <td>
                      {companyData.regularMarketPrice
                        ? `$${companyData.regularMarketPrice.toFixed(2)}`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Price Change (%):</th>
                    <td>
                      {companyData.regularMarketChangePercent
                        ? `${companyData.regularMarketChangePercent.toFixed(
                            2
                          )}%`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>52-Week Range:</th>
                    <td>{companyData.fiftyTwoWeekRange || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Dividend Yield:</th>
                    <td>
                      {companyData.dividendYield
                        ? `${companyData.dividendYield.toFixed(2)}%`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>PE Ratio (Trailing):</th>
                    <td>
                      {companyData.trailingPE
                        ? companyData.trailingPE.toFixed(2)
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>50-Day Moving Average:</th>
                    <td>
                      {companyData.fiftyDayAverage
                        ? `$${companyData.fiftyDayAverage.toFixed(2)}`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>200-Day Moving Average:</th>
                    <td>
                      {companyData.twoHundredDayAverage
                        ? `$${companyData.twoHundredDayAverage.toFixed(2)}`
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right half: Graph and news sections */}
            <div className="stock-extra">
              {/* Upper part: Graph */}
              <div className="stock-graph">
                <StockGraph symbol={symbol} />
              </div>

              {/* Lower part: News section */}
              <div className="stock-news">
                <h2>Latest News</h2>
                {/* Placeholder news articles */}
                <div className="news-article">
                  <h3>News Title 1</h3>
                  <p>Summary of the first news article...</p>
                </div>
                <div className="news-article">
                  <h3>News Title 2</h3>
                  <p>Summary of the second news article...</p>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default StockDetail;
