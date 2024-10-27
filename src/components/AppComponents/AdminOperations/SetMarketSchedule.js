import React, { useState } from "react";
import { setMarketScheduleApi } from "../../../api/marketScheduleApi"; // Import the API function
import "./SetMarketSchedule.css"; // Add styling for this component

const SetMarketSchedule = ({ admin }) => {
  const [formData, setFormData] = useState({
    openTime: "",
    closeTime: "",
    holidays: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const { openTime, closeTime, holidays } = formData;

    // Input validation
    if (!openTime || !closeTime) {
      setError("Please specify both market open and close times.");
      return;
    }

    console.log("Admin Token:", admin.token); // Log admin token for debugging

    try {
      // Call the API to set the market schedule
      const response = await setMarketScheduleApi(
        {
          openTime,
          closeTime,
          holidays: holidays.split(",").map((holiday) => holiday.trim()), // Split and trim holidays string
        },
        admin.token // Pass the admin token for authorization
      );

      console.log("API Response:", response); // Log API response

      // Instead of checking for `response.status`, check if the response contains a message
      if (response.message) {
        setMessage("Market schedule updated successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);

        // Reset the form fields after successful submission
        setFormData({
          openTime: "",
          closeTime: "",
          holidays: "",
        });
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error); // Log the error in detail

      setError("Failed to update market schedule. Please try again.");
    }
  };

  return (
    <div className="set-market-schedule-container">
      <h1>Set Market Schedule</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group-set-market-schedule">
          <label htmlFor="openTime">Market Open Time (UTC):</label>
          <input
            type="time"
            id="openTime"
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-set-market-schedule">
          <label htmlFor="closeTime">Market Close Time (UTC):</label>
          <input
            type="time"
            id="closeTime"
            name="closeTime"
            value={formData.closeTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-set-market-schedule">
          <label htmlFor="holidays">
            Set Holidays (comma-separated, e.g., 2024-12-25, 2024-01-01):
          </label>
          <input
            type="text"
            id="holidays"
            name="holidays"
            placeholder="e.g., 2024-12-25, 2024-01-01"
            value={formData.holidays}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn-set-market-schedule">
          Set Market Schedule
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SetMarketSchedule;
