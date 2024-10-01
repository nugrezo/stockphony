import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <div className="content-landingpage">
        <h1 className="large-text">
          Welcome to a trading experience crafted for…
        </h1>
        <div className="animated-text">
          <span className="word">Manage</span>
          <span className="word">your</span>
          <span className="word">investment</span>
        </div>
      </div>
      <button className="navigate-signUp" onClick={() => navigate("/sign-up")}>
        Join Now
      </button>
    </div>
  );
};

export default LandingPage;
