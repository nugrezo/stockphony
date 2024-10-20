/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./AdminSignIn.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { adminSignIn } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
import DotsLoader from "../../DotsLoader/DotsLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const validAdminIds = ["Ruvier0", "Ergun1", "Austin2"];

const AdminSignIn = ({ msgAlert, setAdmin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminID: "",
    password: "",
  });
  const [adminIDIsValid, setAdminIDIsValid] = useState(true);

  useEffect(() => {
    setFormData({
      adminID: "",
      password: "",
    });
    setAdminIDIsValid(true);
    setLoading(false);
  }, [location.pathname]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "adminID") {
      setAdminIDIsValid(validAdminIds.includes(value));
    }
  };

  const onAdminSignIn = async (event) => {
    event.preventDefault();
    if (!adminIDIsValid) {
      return;
    }

    try {
      setLoading(true);
      const response = await adminSignIn(formData);
      setAdmin(response.data.admin);
      msgAlert({
        heading: "Admin Sign In Success",
        message: messages.signInSuccess,
        variant: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      setFormData({
        adminID: "",
        password: "",
      });
      msgAlert({
        heading: "Admin Sign In Failed with error: " + error.message,
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
        <Form className="admin-sign-in--form" onSubmit={onAdminSignIn}>
          <Form.Group controlId="adminID">
            <Form.Label>Admin ID</Form.Label>
            <div className="input-wrapper">
              <Form.Control
                required
                type="adminID"
                name="adminID"
                value={formData.adminID}
                placeholder="Enter your Admin ID"
                onChange={handleChange}
                style={{
                  backgroundColor: adminIDIsValid ? "" : "#ffc9c9",
                }}
              />
              {adminIDIsValid && formData.adminID.length > 0 && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="check-icon"
                  style={{ color: "green" }}
                />
              )}
            </div>
            {!adminIDIsValid && formData.adminID.length > 0 && (
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
