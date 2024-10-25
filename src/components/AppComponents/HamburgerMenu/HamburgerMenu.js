import React, { useState, useEffect, useRef } from "react";
import { Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {
  FaEye,
  FaListAlt,
  FaMoneyBillWave,
  FaHistory,
  FaUserAlt,
  FaSignOutAlt,
  FaChartLine, // Add icon for Investments
  FaUniversity,
} from "react-icons/fa";
import "./HamburgerMenu.css";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const menuRef = useRef(null); // Ref for the menu container

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Close menu if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, []);

  return (
    <div>
      <Button
        variant="outline-light"
        className="hamburger-btn"
        onClick={toggleMenu}
      >
        ☰
      </Button>
      <div ref={menuRef} className={`menu-container ${isOpen ? "open" : ""}`}>
        <div className="menu-content">
          <Nav.Link
            href="#stock-watch"
            className={`menu-item ${
              activeItem === "stock-watch" ? "active" : ""
            }`}
            onClick={() => handleItemClick("stock-watch")}
          >
            <FaEye className="menu-icon" /> Stock Watch
          </Nav.Link>
          <Nav.Link
            href="#investments"
            className={`menu-item ${
              activeItem === "investments" ? "active" : ""
            }`}
            onClick={() => handleItemClick("investments")}
          >
            <FaChartLine className="menu-icon" /> Investments
          </Nav.Link>
          <Nav.Link
            href="#my-watchlist"
            className={`menu-item ${
              activeItem === "my-watchlist" ? "active" : ""
            }`}
            onClick={() => handleItemClick("my-watchlist")}
          >
            <FaListAlt className="menu-icon" /> My Watchlist
          </Nav.Link>
          <Nav.Link
            href="#bank-info"
            className={`menu-item ${
              activeItem === "bank-info" ? "active" : ""
            }`}
            onClick={() => handleItemClick("bank-info")}
          >
            <FaUniversity className="menu-icon" /> Bank Info
          </Nav.Link>
          <Nav.Link
            href="#transfer-funds"
            className={`menu-item ${
              activeItem === "transfer-funds" ? "active" : ""
            }`}
            onClick={() => handleItemClick("transfer-funds")}
          >
            <FaMoneyBillWave className="menu-icon" /> Transfer Funds
          </Nav.Link>
          <Nav.Link
            href="#transaction-history"
            className={`menu-item ${
              activeItem === "transaction-history" ? "active" : ""
            }`}
            onClick={() => handleItemClick("transaction-history")}
          >
            <FaHistory className="menu-icon" /> Transaction History
          </Nav.Link>
          <Nav.Link
            href="#account-info"
            className={`menu-item ${
              activeItem === "account-info" ? "active" : ""
            }`}
            onClick={() => handleItemClick("account-info")}
          >
            <FaUserAlt className="menu-icon" /> Account Info
          </Nav.Link>
          <Nav.Link
            href="#sign-out"
            className={`menu-item sign-out-btn ${
              activeItem === "sign-out" ? "active" : ""
            }`}
            onClick={() => handleItemClick("sign-out")}
          >
            <FaSignOutAlt className="menu-icon" /> Sign Out
          </Nav.Link>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
