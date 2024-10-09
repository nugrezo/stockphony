import React, { Fragment } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "./Header.css";

const authenticatedOptions = (
  <Fragment>
    <Nav.Link className="sign-out" href="#sign-out">
      <Button variant="outline-light" className="sign-out-btn">
        Logout
      </Button>
    </Nav.Link>
  </Fragment>
);

const unauthenticatedOptions = (
  <Fragment>
    <Nav.Link className="about-app" href="#about-app">
      <Button variant="outline-light" className="about-btn">
        About
      </Button>
    </Nav.Link>
    <Nav.Link className="sign-up" href="#adminSign-in">
      <Button variant="outline-light" className="sign-up-btn">
        Admin Login
      </Button>
    </Nav.Link>
    <Nav.Link className="sign-up" href="#sign-up">
      <Button variant="outline-light" className="sign-up-btn">
        User Login
      </Button>
    </Nav.Link>
  </Fragment>
);

const alwaysOptions = <Fragment></Fragment>;

const Header = ({ user }) => (
  <Navbar className="navbar" expand="md">
    <Navbar.Brand className="brand" href="#">
      <img
        src={`${process.env.PUBLIC_URL}/logo.png`}
        className="App-logo"
        alt="logo"
      />
    </Navbar.Brand>
    <Nav className="ml-auto">
      {user && (
        <span className="navbar-text mr-2">
          Welcome, <strong>{user.username}</strong>
        </span>
      )}
      {alwaysOptions}
      {user ? authenticatedOptions : unauthenticatedOptions}
    </Nav>
  </Navbar>
);

export default Header;
