import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOperations.css"; // Add your custom CSS for layout

const AdminOperations = ({ admin }) => {
  const navigate = useNavigate();

  const handleAddStock = () => {
    navigate("/add-stock", { state: { admin } }); // Assuming /add-stock route is where the stock addition form is located
  };

  const handleSetMarketSchedule = () => {
    navigate("/set-market-schedule"); // Assuming /set-market-schedule route is for setting market schedule
  };

  return (
    <div className="admin-operations">
      <h1 className="admin-operations-header">Admin Operations</h1>
      <div className="admin-operations-container">
        <div className="admin-operations-section">
          <h2>Set Market Schedule</h2>
          <p>
            Define market open and close hours or adjust the schedule for
            holidays. Use this option to control when the market should be open
            for trading.
          </p>
          <button
            onClick={handleSetMarketSchedule}
            className="admin-operation-btn"
          >
            Set Market Schedule
          </button>
        </div>

        {/* Right Section - Add Stock */}
        <div className="admin-operations-section-add-stock">
          <h2>Add Stock</h2>
          <p>
            Add new stocks to the platform by providing details like stock
            symbol, price, and other relevant information.
          </p>
          <button
            onClick={handleAddStock}
            className="admin-operation-btn-add-stock"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;
