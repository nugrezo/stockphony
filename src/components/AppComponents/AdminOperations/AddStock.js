import React, { useState } from "react";
import { useStocks } from "./StockContext"; // Import the context
import { addStock as apiAddStock } from "../../../api/stockApi"; // Import the addStock function from stockApi.js
import "./AddStock.css";

const AddStock = ({ admin }) => {
  const { addStock } = useStocks(); // Get the addStock function from the context

  const [formData, setFormData] = useState({
    companyName: "",
    stockTicker: "",
    stockVolume: "",
    initialPrice: "",
    dayHigh: "",
    dayLow: "",
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

    const {
      companyName,
      stockTicker,
      stockVolume,
      initialPrice,
      dayHigh,
      dayLow,
    } = formData;

    // Validate that all required fields are filled out
    if (
      !companyName ||
      !stockTicker ||
      !stockVolume ||
      !initialPrice ||
      !dayHigh ||
      !dayLow
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    // Validate that numeric fields are actually numbers
    if (
      isNaN(stockVolume) ||
      isNaN(initialPrice) ||
      isNaN(dayHigh) ||
      isNaN(dayLow)
    ) {
      setError("Stock volume, price, day high, and day low must be numbers.");
      return;
    }

    console.log("Submitting stock:", formData); // Log the data being sent

    // Log the admin token to check if it's being passed correctly
    console.log("Admin token:", admin.token);

    // API call to add stock with admin's token
    try {
      const response = await apiAddStock(
        {
          companyName,
          stockTicker,
          stockVolume,
          initialPrice,
          dayHigh,
          dayLow,
        },
        admin.token // Pass admin token for authorization
      );

      console.log("API Response:", response); // Log the response to check

      if (response.status === 201) {
        const addedStock = response.data.stock;

        // Add the stock to the context
        addStock({
          symbol: addedStock.stockTicker,
          price: addedStock.initialPrice,
          dayHigh: addedStock.dayHigh,
          dayLow: addedStock.dayLow,
          change: 0,
          changePercent: 0,
        });

        setMessage(`Stock ${addedStock.companyName} added successfully!`);

        // Clear the success message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000); // 3000 milliseconds = 3 seconds

        // Reset the form fields after successful submission
        setFormData({
          companyName: "",
          stockTicker: "",
          stockVolume: "",
          initialPrice: "",
          dayHigh: "",
          dayLow: "",
        });
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error); // Log the error in detail

      // Check if the error is due to a duplicate stock
      if (
        error.response &&
        error.response.data.message === "Stock with this ticker already exists."
      ) {
        setError("Stock with this ticker already exists.");
      } else {
        setError("Failed to add stock. Please try again.");
      }
    }
  };

  return (
    <div className="add-stock-container">
      <h1>Add New Stock</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stockTicker">Stock Ticker (Symbol):</label>
          <input
            type="text"
            id="stockTicker"
            name="stockTicker"
            value={formData.stockTicker}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stockVolume">Stock Volume (Shares Available):</label>
          <input
            type="number"
            id="stockVolume"
            name="stockVolume"
            value={formData.stockVolume}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="initialPrice">Initial Price ($):</label>
          <input
            type="number"
            id="initialPrice"
            name="initialPrice"
            value={formData.initialPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dayHigh">Day High ($):</label>
          <input
            type="number"
            id="dayHigh"
            name="dayHigh"
            value={formData.dayHigh}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dayLow">Day Low ($):</label>
          <input
            type="number"
            id="dayLow"
            name="dayLow"
            value={formData.dayLow}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Stock
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddStock;
