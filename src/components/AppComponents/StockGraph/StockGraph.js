import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockGraph = ({ symbol }) => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      const options = {
        method: "GET",
        url: "https://yahoo-finance-api-data.p.rapidapi.com/chart/advanced-chart",
        params: {
          symbol,
          limit: "10",
          from: "1516393361", // Unix timestamp for the "from" date
          to: "1721421317", // Unix timestamp for the "to" date
          range: "1d",
        },
        headers: {
          "x-rapidapi-key":
            "ab82c2d418msh930303db1916df5p195d71jsn14f6a800ea84",
          "x-rapidapi-host": "yahoo-finance-api-data.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        console.log("Full API Response:", response.data);

        // Extract relevant data from response
        const data = response.data.data[0];
        const timestamps = data.timestamp;
        const closingPrices = data.indicators.quote[0].close; // Extracting close prices

        // Format data for Recharts
        const formattedData = timestamps.map((time, index) => ({
          date: new Date(time * 1000).toLocaleDateString(), // Formatting date
          price: closingPrices[index], // Use close prices for the Y-axis
        }));

        setGraphData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching stock graph data:",
          error.response ? error.response.data : error.message
        );
        setError(error);
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [symbol]);

  if (loading) {
    return <div>Loading graph...</div>;
  }

  if (error) {
    return <div>Error loading graph data</div>;
  }

  return (
    <div>
      <h2>Stock Performance Graph for {symbol}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" /> {/* X-axis shows the date */}
          <YAxis dataKey="price" /> {/* Y-axis shows the price */}
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />{" "}
          {/* Display close prices */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockGraph;
