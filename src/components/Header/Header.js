import React, { Fragment } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "./Header.css";

const authenticatedUserOptions = (
  <Fragment>
    <Nav.Link className="sign-up" href="#stock-watch">
      <Button variant="outline-light" className="sign-up-btn">
        Stock Watch
      </Button>
    </Nav.Link>
    <Nav.Link className="sign-out" href="#sign-out">
      <Button variant="outline-light" className="sign-out-btn">
        Logout
      </Button>
    </Nav.Link>
  </Fragment>
);

const authenticatedAdminOptions = (
  <Fragment>
    <Nav.Link className="sign-out" href="#admin-sign-out">
      <Button variant="outline-light" className="sign-out-btn">
        Admin Logout
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
    <Nav.Link className="sign-up" href="#admin-sign-up">
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

const Header = ({ user, admin }) => (
  <Navbar className="navbar" expand="md">
    {user || admin ? (
      <Navbar.Brand className="brand">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          className="App-logo"
          alt="logo"
        />
      </Navbar.Brand>
    ) : (
      <Navbar.Brand className="brand" href="#">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          className="App-logo"
          alt="logo"
        />
      </Navbar.Brand>
    )}
    <Nav className="ml-auto">
      {user && (
        <span className="navbar-text mr-2">
          Welcome, <strong>{user.username}</strong>
        </span>
      )}
      {admin && (
        <span className="navbar-text mr-2">
          Admin Panel for <strong>{admin.adminID}</strong>
        </span>
      )}
      {alwaysOptions}

      {(() => {
        if (user) {
          return authenticatedUserOptions;
        } else if (admin) {
          return authenticatedAdminOptions;
        } else {
          return unauthenticatedOptions;
        }
      })()}
    </Nav>
  </Navbar>
);

export default Header;
