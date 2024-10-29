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
    randomPriceGenerator: "no", // New field for random price generator
  });
  console.log("Form data being submitted:", formData);

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
    console.log("Form data being submitted:", formData); // Log form data

    const {
      companyName,
      stockTicker,
      stockVolume,
      initialPrice,
      dayHigh,
      dayLow,
      randomPriceGenerator,
    } = formData;
    console.log("Random Price Generator value:", randomPriceGenerator); // Check its value here

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

    if (
      isNaN(stockVolume) ||
      isNaN(initialPrice) ||
      isNaN(dayHigh) ||
      isNaN(dayLow)
    ) {
      setError("Stock volume, price, day high, and day low must be numbers.");
      return;
    }

    try {
      const response = await apiAddStock(
        {
          companyName,
          stockTicker,
          stockVolume,
          initialPrice,
          dayHigh,
          dayLow,
          randomPriceGenerator, // Pass randomPriceGenerator option
        },
        admin.token // Pass admin token for authorization
      );

      if (response.status === 201) {
        const addedStock = response.data.stock;
        addStock({
          symbol: addedStock.stockTicker,
          price: addedStock.initialPrice,
          dayHigh: addedStock.dayHigh,
          dayLow: addedStock.dayLow,
          randomPriceGenerator,
          change: 0,
          changePercent: 0,
        });

        setMessage(`Stock ${addedStock.companyName} added successfully!`);
        setTimeout(() => setMessage(""), 3000);

        setFormData({
          companyName: "",
          stockTicker: "",
          stockVolume: "",
          initialPrice: "",
          dayHigh: "",
          dayLow: "",
          randomPriceGenerator: "no",
        });
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
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
        <div className="form-group-add-new-stock">
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

        <div className="form-group-add-new-stock">
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

        <div className="form-group-add-new-stock">
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

        <div className="form-group-add-new-stock">
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

        <div className="form-group-add-new-stock">
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

        <div className="form-group-add-new-stock">
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

        <div className="form-group-add-new-stock">
          <label htmlFor="randomPriceGenerator">Random Price Generator:</label>
          <select
            id="randomPriceGenerator"
            name="randomPriceGenerator"
            value={formData.randomPriceGenerator}
            onChange={handleChange}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
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
