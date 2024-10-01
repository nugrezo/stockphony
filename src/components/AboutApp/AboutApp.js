import React from "react";
import { useNavigate } from "react-router-dom";

import "./AboutApp.css";

const AboutApp = () => {
  const navigate = useNavigate();
  return (
    <div className="wrapper-about">
      <div className="about-app-container">
        <h2>About Stockphony</h2>
        <div className="what-is-stockphony">
          Welcome to <strong>STOCKPHONY</strong>, the next-generation stock
          trading platform designed to help investors of all levels easily
          manage and grow their financial portfolio. Whether you are a seasoned
          trader or a beginner exploring the stock market, our user-friendly
          platform provides the tools you need to make informed decisions and
          execute trades efficiently.
        </div>
        <div>
          <h5>Features</h5>
          <p>
            <img
              src={`${process.env.PUBLIC_URL}/buy_sell.png`}
              alt="Buy and Sell"
              className="about-icons"
            />
            Seamlessly execute trades, buy, or sell stocks with real-time data
            and fast execution.
          </p>
          <p>
            <img
              src={`${process.env.PUBLIC_URL}/track.png`}
              alt="track"
              className="about-icons"
            />
            Track your stock holdings, view your performance over time, and
            manage your investments.
          </p>
          <p>
            <img
              src={`${process.env.PUBLIC_URL}/review.png`}
              alt="review"
              className="about-icons"
            />
            Easily review your past trades, deposits, withdrawals, and other key
            financial activities.
          </p>
          <p>
            <img src={`${process.env.PUBLIC_URL}/balance.png`} alt="balance" />
            Manage your cash balance with deposit and withdrawal features to
            maintain liquidity.
          </p>
          <p>
            <img
              src={`${process.env.PUBLIC_URL}/real-time.png`}
              alt="real-time"
              className="about-icons"
            />
            Access real-time data and simulated stock price movements, helping
            you stay ahead in a fast-moving market.
          </p>
        </div>

        <button
          className="navigate-signUp"
          onClick={() => navigate("/sign-up")}
        >
          Join Now
        </button>
      </div>
    </div>
  );
};

export default AboutApp;
