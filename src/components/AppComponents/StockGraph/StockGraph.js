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

const POLYGON_API_KEY = "1MiNYlVeAeCfTKgS1Hs_d5hcaGNm2T8p"; // Use the API key you provided

const StockGraph = ({ symbol }) => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      const fromDate = "2020-01-01"; // Adjust the date range as needed
      const toDate = "2024-10-31"; // Fetch data for January 2024 as an example

      try {
        // Fetch historical stock data from Polygon.io Aggregates API
        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}`,
          {
            params: { apiKey: POLYGON_API_KEY },
          }
        );

        const data = response.data.results; // Get the results from the response

        // Format data for Recharts
        const formattedData = data.map((item) => ({
          date: new Date(item.t).toLocaleDateString(), // Convert timestamp to date string
          price: item.c, // Use the closing price for the Y-axis
        }));

        setGraphData(formattedData); // Set graph data for rendering
        setLoading(false); // Stop loading spinner
      } catch (error) {
        console.error("Error fetching stock graph data:", error);
        setError(error); // Handle error
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
          <YAxis dataKey="price" /> {/* Y-axis shows the closing price */}
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />{" "}
          {/* Line for closing prices */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockGraph;
