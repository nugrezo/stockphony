/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StockDetail.css";
import StockGraph from "../StockGraph/StockGraph";

// Use your Finnhub API key
const FINNHUB_API_KEY = "csa9d79r01qsm2oanoc0csa9d79r01qsm2oanocg";

const StockDetail = () => {
  const { symbol } = useParams(); // Get stock symbol from the URL
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        // Fetch company profile and stock data from Finnhub API
        const companyProfileResponse = await axios.get(
          "https://finnhub.io/api/v1/stock/profile2",
          {
            params: { symbol, token: FINNHUB_API_KEY },
          }
        );

        const stockPriceResponse = await axios.get(
          "https://finnhub.io/api/v1/quote",
          {
            params: { symbol, token: FINNHUB_API_KEY },
          }
        );

        // Combine company profile and stock data
        const companyInfo = {
          ...companyProfileResponse.data,
          ...stockPriceResponse.data,
        };

        setCompanyData(companyInfo); // Save the company info to state
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
                {companyData.name ||
                  companyData.ticker ||
                  "Company Name Not Available"}{" "}
                Company Profile
              </h1>

              {/* Table for stock details */}
              <table className="stock-table">
                <tbody>
                  <tr>
                    <th>Symbol:</th>
                    <td>{companyData.ticker || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Market Cap:</th>
                    <td>
                      {companyData.marketCapitalization
                        ? `$${(companyData.marketCapitalization / 1e9).toFixed(
                            2
                          )}B`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Stock Price:</th>
                    <td>
                      {companyData.c ? `$${companyData.c.toFixed(2)}` : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Price Change (%):</th>
                    <td>
                      {companyData.dp ? `${companyData.dp.toFixed(2)}%` : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Day High:</th>
                    <td>
                      {companyData.h ? `$${companyData.h.toFixed(2)}` : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Day Low:</th>
                    <td>
                      {companyData.l ? `$${companyData.l.toFixed(2)}` : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>PE Ratio:</th>
                    <td>
                      {companyData.pe ? companyData.pe.toFixed(2) : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Industry:</th>
                    <td>{companyData.finnhubIndustry || "N/A"}</td>
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
