import React from "react";
import "./Threadify.css"; // Import your CSS file for styling

const Threadify = () => {
  return (
    <div className="threadify-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 40 200 200"
        className="vector-shape connect"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="threadify-text"
        >
          Connect
        </text>
        <br />
        <br />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="vector-shape middle"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="threadify-text-with"
        >
          with
        </text>
        <br />
        <br />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -40 200 200"
        className="vector-shape people"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="threadify-text"
        >
          People
        </text>
      </svg>
    </div>
  );
};

export default Threadify;
