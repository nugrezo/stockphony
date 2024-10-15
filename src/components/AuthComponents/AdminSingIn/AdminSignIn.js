/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./AdminSignIn.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signIn } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
import DotsLoader from "../../DotsLoader/DotsLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const validAdminIds = ["Ruvier0", "Ergun1", "Austin2"];

const AdminSignIn = ({ msgAlert, setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [adminIDIsValid, setAdminIDIsValid] = useState(true);

  useEffect(() => {
    setFormData({
      username: "",
      password: "",
    });
    setAdminIDIsValid(true);
    setLoading(false);
  }, [location.pathname]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "username") {
      setAdminIDIsValid(validAdminIds.includes(value));
    }
  };

  const onSignIn = async (event) => {
    event.preventDefault();
    if (!adminIDIsValid) {
      return;
    }

    try {
      setLoading(true);
      const response = await signIn(formData);
      setUser(response.data.user);
      msgAlert({
        heading: "Sign In Success",
        message: messages.signInSuccess,
        variant: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      setFormData({
        username: "",
        password: "",
      });
      msgAlert({
        heading: "Sign In Failed with error: " + error.message,
        message: messages.signInFailure,
        variant: "danger",
      });
    }
  };

  return (
    <div className="admin-sign-in-container">
      <div className="admin-sign-in-form">
        <img
          src={`${process.env.PUBLIC_URL}/Admin.png`}
          alt="admin-png"
          className="admin-image"
        />
        <Form className="admin-sign-in--form" onSubmit={onSignIn}>
          <Form.Group controlId="username">
            <Form.Label>Admin ID</Form.Label>
            <div className="input-wrapper">
              <Form.Control
                required
                type="username"
                name="username"
                value={formData.username}
                placeholder="Enter your Admin ID"
                onChange={handleChange}
                style={{
                  backgroundColor: adminIDIsValid ? "" : "#ffc9c9",
                }}
              />
              {adminIDIsValid && formData.username.length > 0 && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="check-icon"
                  style={{ color: "green" }}
                />
              )}
            </div>
            {!adminIDIsValid && formData.username.length > 0 && (
              <Form.Text className="text-danger">
                Admin ID is not correct
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="input-wrapper">
              <Form.Control
                required
                name="password"
                value={formData.password}
                type="password"
                placeholder="Enter your Password"
                onChange={handleChange}
              />
            </div>
          </Form.Group>
          <Button className="admin-sign-in--btn" type="submit">
            {loading ? <DotsLoader /> : "ADMIN Sign In"}
          </Button>
          <div className="navigate-admin-sign-up">
            <p className="admin-no-account">Don’t have an account?</p>
            <Nav.Link className="navigate--admin-sign-up" href="#admin-sign-up">
              Sign Up
            </Nav.Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdminSignIn;
