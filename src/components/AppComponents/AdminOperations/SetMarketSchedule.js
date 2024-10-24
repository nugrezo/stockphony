import React, { useState } from "react";
import axios from "axios";
import "./SetMarketSchedule.css"; // Add styling for this component

const SetMarketSchedule = () => {
  // State for market open/close times and holidays
  const [marketOpenTime, setMarketOpenTime] = useState("");
  const [marketCloseTime, setMarketCloseTime] = useState("");
  const [holidays, setHolidays] = useState(""); // Use a string or array depending on the format you want for holidays
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous messages
    setMessage("");
    setError("");

    // Input validation
    if (!marketOpenTime || !marketCloseTime) {
      setError("Please specify both market open and close times.");
      return;
    }

    try {
      // Make API request to update market schedule
      const response = await axios.post("/api/set-market-schedule", {
        openTime: marketOpenTime,
        closeTime: marketCloseTime,
        holidays: holidays.split(",").map((holiday) => holiday.trim()), // Assuming holidays are input as a comma-separated string
      });

      setMessage(response.data.message);
    } catch (error) {
      setError("Failed to update market schedule. Please try again.");
    }
  };

  return (
    <div className="set-market-schedule-container">
      <h1>Set Market Schedule</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="marketOpenTime">Market Open Time (UTC):</label>
          <input
            type="time"
            id="marketOpenTime"
            value={marketOpenTime}
            onChange={(e) => setMarketOpenTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="marketCloseTime">Market Close Time (UTC):</label>
          <input
            type="time"
            id="marketCloseTime"
            value={marketCloseTime}
            onChange={(e) => setMarketCloseTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="holidays">
            Set Holidays (comma-separated, e.g., 2024-12-25, 2024-01-01):
          </label>
          <input
            type="text"
            id="holidays"
            value={holidays}
            onChange={(e) => setHolidays(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Set Market Schedule
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SetMarketSchedule;
