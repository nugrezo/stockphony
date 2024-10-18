/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./AdminSignUp.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { adminSignIn, adminSignUp } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
import DotsLoader from "../../DotsLoader/DotsLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S{2,}$/;
  const isValidFormat = emailRegex.test(email);

  if (isValidFormat) {
    const validDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      // add rest of the domains
    ];
    const domain = email.split("@")[1].toLowerCase();
    return validDomains.includes(domain);
  } else {
    return false;
  }
};

const validateFullName = (fullName) => {
  const parts = fullName
    .trim()
    .split(" ")
    .filter((part) => part.length > 0);

  return parts.length >= 2 && parts.every((part) => part.length > 1);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return passwordRegex.test(password);
};

const validAdminIds = ["Ruvier0", "Ergun1", "Austin2"];

const AdminSignUp = ({ msgAlert, setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    adminID: "",
    password: "",
    passwordConfirmation: "",
  });
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [adminIDIsValid, setAdminIDIsValid] = useState(true);

  const [passwordConfirmationIsValid, setPasswordConfirmationIsValid] =
    useState(true);
  const [fullNameIsValid, setFullNameIsValid] = useState(true);

  const image = `${process.env.PUBLIC_URL}/Admin.png`;

  useEffect(() => {
    setFormData({
      fullName: "",
      email: "",
      adminID: "",
      password: "",
      passwordConfirmation: "",
    });
    setFullNameIsValid(true);
    setEmailIsValid(true);
    setAdminIDIsValid(true);
    setPasswordIsValid(true);
    setPasswordConfirmationIsValid(true);
    setLoading(false); // Reset loading state as well if needed
  }, [location.pathname]); // Reset when the route changes

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "fullName") {
      setFullNameIsValid(validateFullName(value));
    } else if (name === "email") {
      setEmailIsValid(validateEmail(value));
    } else if (name === "adminID") {
      setAdminIDIsValid(validAdminIds.includes(value));
    } else if (name === "password") {
      setPasswordIsValid(validatePassword(value));
    } else if (name === "passwordConfirmation") {
      setPasswordConfirmationIsValid(value === formData.password);
    }
  };

  const onAdminSignUp = async (event) => {
    event.preventDefault();
    if (
      !fullNameIsValid ||
      !emailIsValid ||
      !adminIDIsValid ||
      !passwordIsValid
    ) {
      return;
    }

    try {
      setLoading(true);
      await adminSignUp(formData);
      const response = await adminSignIn(formData);
      setUser(response.data.user);
      msgAlert({
        heading: "Sign Up Success",
        message: messages.signUpSuccess,
        variant: "success",
      });
      navigate("/examples");
    } catch (error) {
      setLoading(false);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        adminID: "",
        passwordConfirmation: "",
      });
      msgAlert({
        heading: "Sign Up Failed with error: " + error.message,
        message: messages.signUpFailure,
        variant: "danger",
      });
    }
  };

  return (
    <div className="admin-sign-up-container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="admin-sign-up-form">
        <img src={image} alt="admin-png" className="admin-image" />
        <Form className="admin-sign-up--form" onSubmit={onAdminSignUp}>
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
          <Form.Group controlId="fullname">
            <Form.Label>Full Name</Form.Label>
            <div className="input-wrapper">
              <Form.Control
                required
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder="Enter your Full Name"
                onChange={handleChange}
                style={{
                  backgroundColor: fullNameIsValid ? "" : "#ffc9c9",
                }}
              />
              {fullNameIsValid && formData.fullName.length > 0 && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="check-icon"
                  style={{ color: "green" }}
                />
              )}
            </div>
            {!fullNameIsValid && (
              <Form.Text className="text-danger">
                Full name is not valid.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <div className="input-wrapper">
              <Form.Control
                required
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                style={{
                  backgroundColor: emailIsValid ? "" : "#ffc9c9",
                }}
              />
              {emailIsValid && formData.email.length > 0 && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="check-icon"
                  style={{ color: "green" }}
                />
              )}
            </div>
            {!emailIsValid && formData.email.length > 0 && (
              <Form.Text className="text-danger">
                Invalid email format
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
                style={{
                  backgroundColor: passwordIsValid ? "" : "#ffc9c9",
                }}
              />
              {passwordIsValid && formData.password.length > 0 && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="check-icon"
                  style={{ color: "green" }}
                />
              )}
            </div>
            {!passwordIsValid && (
              <Form.Text className="text-danger">
                Min 8 characters, 1 uppercase, 1 number, 1 special
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="passwordConfirmation">
            <Form.Label>Password Confirmation</Form.Label>
            <div className="input-wrapper">
              <Form.Control
                required
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                style={{
                  backgroundColor: passwordConfirmationIsValid ? "" : "#ffc9c9",
                }}
              />
              {passwordConfirmationIsValid &&
                formData.passwordConfirmation.length > 0 && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="check-icon"
                    style={{ color: "green" }}
                  />
                )}
            </div>
            {!passwordConfirmationIsValid &&
              formData.passwordConfirmation.length > 0 && (
                <Form.Text className="text-danger">
                  Password does not match
                </Form.Text>
              )}
          </Form.Group>
          <Button className="admin-sign-up--btn" type="submit">
            {loading ? <DotsLoader /> : "ADMIN Sign Up"}
          </Button>
          <div className="navigate-admin-sign-in">
            <p className="have-account">Have an account?</p>
            <Nav.Link className="navigate--admin-sign-in" href="#admin-sign-in">
              Sign In
            </Nav.Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdminSignUp;
