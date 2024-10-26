import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useStocks } from "../AdminOperations/StockContext"; // Import StockContext to access buyingPower
import "./Investments.css";

// Register required chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const sampleGraphData = {
  labels: ["1D", "1W", "1M", "3M", "1Y"],
  datasets: [
    {
      label: "Total Investment",
      data: [1000, 1500, 1300, 1800, 2000],
      borderColor: "green",
      backgroundColor: "rgba(0, 128, 0, 0.2)",
      tension: 0.3,
    },
  ],
};

const sampleStockInvestments = [
  {
    name: "AAPL",
    date: "2023-10-01",
    shares: 10,
    purchasePrice: 150,
    avgCost: 160,
  },
  {
    name: "TSLA",
    date: "2023-08-15",
    shares: 5,
    purchasePrice: 700,
    avgCost: 720,
  },
];

const Investments = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Access buyingPower from StockContext
  const { buyingPower } = useStocks();

  // Calculate total stock investment amount
  const totalStockInvestment = sampleStockInvestments.reduce(
    (total, stock) => total + stock.shares * stock.avgCost,
    0
  );

  // Calculate total investment including buyingPower
  const totalInvestment = buyingPower + totalStockInvestment;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="investments-container">
      {/* Investment Graph */}
      <div className="investment-graph">
        <Line
          data={sampleGraphData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>

      {/* Buying Power */}
      <div className="investment-info">
        <span className="label">Buying Power:</span>
        <span className="amount">${buyingPower.toFixed(2)}</span>
      </div>

      {/* Stock Investment */}
      <div className="investment-info" onClick={toggleExpand}>
        <span className="label">Stock Investment:</span>
        <span className="amount">${totalStockInvestment.toFixed(2)}</span>
      </div>

      {/* Expandable Stock List */}
      {isExpanded && (
        <div className="stock-investments">
          {/* Headers */}
          <div className="stock-item header">
            <span>Stock Name</span>
            <span>Date</span>
            <span>Shares</span>
            <span>Purchase Price</span>
            <span>Avg Cost</span>
            <span>Amount</span>
          </div>

          {/* Stock Data */}
          {sampleStockInvestments.map((stock, index) => (
            <div key={index} className="stock-item">
              <span>{stock.name}</span>
              <span>{stock.date}</span>
              <span>{stock.shares}</span>
              <span>${stock.purchasePrice}</span>
              <span>${stock.avgCost}</span>
              <span>${(stock.shares * stock.avgCost).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total Investment */}
      <div className="investment-info total">
        <span className="label">Total Investment:</span>
        <span className="amount">${totalInvestment.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Investments;
