import React from "react";
import { useNavigate } from "react-router-dom";

import "./AboutApp.css";

const AboutApp = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>About Threadify</h2>
      <div className="about-app-container">
        <div className="what-is-threadfy">
          Welcome to <strong>Threadify</strong>, where vibrant discussions come
          alive through seamless thread interactions. Explore diverse topics,
          share your thoughts, and connect with like-minded individuals in a
          refreshing social media experience
        </div>
        <div>
          <h5>Features</h5>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#e67700"
            className="account-creation"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <p>
            Users can create a secure account before interacting with other
            users. To address utmost security concerns, user accounts are
            encrypted using passport and crypto technology.
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#e67700"
              className="account-creation"
              width="50"
              height="50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Users can easily create their own threads on various topics,
            expressing their thoughts, opinions, and interests to the Threadify
            community.
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#e67700"
            className="account-creation"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
          <p>
            Users can engage with others&#39; threads, allowing them to like and
            comment on posts, fostering vibrant discussions and community
            interaction.
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#e67700"
            className="account-creation"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>

          <p>
            Users can manage their own threads and own threadify account via
            displaying their own threads and own account information.
            Additionally users can manage their profile photo.
          </p>
        </div>

        <button
          className="navigate-signUp"
          onClick={() => navigate("/sign-up")}
        >
          Join Now
        </button>
      </div>
    </div>
  );
};

export default AboutApp;
