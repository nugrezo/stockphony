import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useStocks } from "../AdminOperations/StockContext";
import "./Investments.css";

// Register required chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Investments = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { investments, buyingPower } = useStocks();

  // Calculate total stock investment amount
  const totalStockInvestment = investments.reduce(
    (total, stock) => total + stock.shares * stock.avgCost,
    0
  );

  // Calculate total investment including buyingPower
  const totalInvestment = buyingPower + totalStockInvestment;

  // State to store historical data for the line chart
  const [graphData, setGraphData] = useState({
    labels: ["1D", "1W", "1M", "3M", "1Y"],
    datasets: [
      {
        label: "Buying Power",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
      {
        label: "Stock Investment",
        data: [],
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        tension: 0.3,
      },
      {
        label: "Total Investment",
        data: [],
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        tension: 0.3,
      },
    ],
  });

  // Update the graph data whenever `buyingPower` or `totalStockInvestment` changes
  useEffect(() => {
    setGraphData((prevGraphData) => {
      const updatedBuyingPowerData = [
        ...prevGraphData.datasets[0].data,
        buyingPower,
      ];
      const updatedStockInvestmentData = [
        ...prevGraphData.datasets[1].data,
        totalStockInvestment,
      ];
      const updatedTotalInvestmentData = [
        ...prevGraphData.datasets[2].data,
        totalInvestment,
      ];
      const updatedLabels = [...prevGraphData.labels];

      // Ensure we only keep the last 5 data points (1D, 1W, 1M, 3M, 1Y)
      if (updatedBuyingPowerData.length > 5) updatedBuyingPowerData.shift();
      if (updatedStockInvestmentData.length > 5)
        updatedStockInvestmentData.shift();
      if (updatedTotalInvestmentData.length > 5)
        updatedTotalInvestmentData.shift();
      if (updatedLabels.length > 5) updatedLabels.shift();

      return {
        ...prevGraphData,
        datasets: [
          { ...prevGraphData.datasets[0], data: updatedBuyingPowerData },
          { ...prevGraphData.datasets[1], data: updatedStockInvestmentData },
          { ...prevGraphData.datasets[2], data: updatedTotalInvestmentData },
        ],
        labels: updatedLabels,
      };
    });
  }, [buyingPower, totalStockInvestment]);

  // Data for the pie chart
  const pieChartData = {
    labels: ["Buying Power", "Stock Investment"],
    datasets: [
      {
        data: [buyingPower, totalStockInvestment],
        backgroundColor: ["#4bc0c0", "#ffcd56"],
        hoverBackgroundColor: ["#4bc0c0cc", "#ffcd56cc"],
      },
    ],
  };

  // Toggle expand/collapse for investment details
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Format dates to a readable format
  // const formatDate = (date) => {
  //   return new Date(date).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  return (
    <div className="investment-container-wrapper">
      {/* Left side: Line chart and investment details */}
      <div className="investments-container">
        <div className="investment-graph">
          <Line
            data={graphData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        {/* Buying Power */}
        <div className="investment-info">
          <span className="label">Buying Power:</span>
          <span className="amount">
            ${buyingPower.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Stock Investment */}
        <div className="investment-info" onClick={toggleExpand}>
          <span className="label">Stock Investment:</span>
          <span className="amount">
            $
            {totalStockInvestment.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Expandable Stock List */}
        {isExpanded && (
          <div className="stock-investments">
            {/* Headers */}
            <div className="stock-item header">
              <span>Stock Name</span>
              <span>Shares</span>
              <span>Purchase Price</span>
              <span>Avg Cost</span>
              <span>Amount</span>
            </div>

            {/* Dynamic Stock Data */}
            {investments.map((stock, index) => (
              <div key={index} className="stock-item">
                <span>{stock.stockTicker}</span>
                <span>{stock.shares}</span>
                <span>${stock.purchasePrice.toFixed(2)}</span>
                <span>
                  $
                  {typeof stock.avgCost === "number"
                    ? stock.avgCost.toFixed(2)
                    : "N/A"}
                </span>
                <span>
                  $
                  {(stock.shares * stock.avgCost).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total Investment */}
        <div className="investment-info total">
          <span className="label">Total Investment:</span>
          <span className="amount">
            $
            {totalInvestment.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Right side: Pie chart */}
      <div className="pie-chart-container">
        <Pie
          data={pieChartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default Investments;
