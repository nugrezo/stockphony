/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./adminSignUp.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signIn, signUp } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
import DotsLoader from "../../DotsLoader/DotsLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const imageArray = [
  `${process.env.PUBLIC_URL}/stock_chart.png`,
  `${process.env.PUBLIC_URL}/stock_chart1.png`,
  `${process.env.PUBLIC_URL}/stock_chart2.png`,
  `${process.env.PUBLIC_URL}/stock_chart3.png`,
  `${process.env.PUBLIC_URL}/stock_chart4.png`,
  `${process.env.PUBLIC_URL}/stock_chart5.png`,
  `${process.env.PUBLIC_URL}/stock_chart6.png`,
  `${process.env.PUBLIC_URL}/stock_chart7.png`,
  `${process.env.PUBLIC_URL}/stock_chart8.png`,
  `${process.env.PUBLIC_URL}/stock_chart9.png`,
  `${process.env.PUBLIC_URL}/stock_chart10.png`,
  `${process.env.PUBLIC_URL}/stock_chart11.png`,
  `${process.env.PUBLIC_URL}/stock_chart12.png`,
  `${process.env.PUBLIC_URL}/stock_chart13.png`,
  `${process.env.PUBLIC_URL}/stock_chart14.png`,
  `${process.env.PUBLIC_URL}/stock_chart15.png`,
];

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

const validateUsername = (username) => {
  const usernameRegex = /^(?!.*\s)(?=.*[0-9]).{5,}$/;
  return usernameRegex.test(username);
};

const adminSignUp = ({ msgAlert, setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [usernameIsValid, setUsernameIsValid] = useState(true);

  const [passwordConfirmationIsValid, setPasswordConfirmationIsValid] =
    useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullNameIsValid, setFullNameIsValid] = useState(true);

  useEffect(() => {
    setFormData({
      fullName: "",
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    });
    setFullNameIsValid(true);
    setEmailIsValid(true);
    setUsernameIsValid(true);
    setPasswordIsValid(true);
    setPasswordConfirmationIsValid(true);
    setLoading(false); // Reset loading state as well if needed
  }, [location.pathname]); // Reset when the route changes

  // Handle image slideshow
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "fullName") {
      // Changed to check userName
      setFullNameIsValid(validateFullName(value));
    } else if (name === "email") {
      setEmailIsValid(validateEmail(value));
    } else if (name === "username") {
      setUsernameIsValid(validateUsername(value));
    } else if (name === "password") {
      setPasswordIsValid(validatePassword(value));
    } else if (name === "passwordConfirmation") {
      setPasswordConfirmationIsValid(value === formData.password);
    }
  };

  const onSignUp = async (event) => {
    event.preventDefault();
    if (
      !fullNameIsValid ||
      !emailIsValid ||
      !usernameIsValid ||
      !passwordIsValid
    ) {
      return;
    }

    try {
      setLoading(true);
      await signUp(formData);
      const response = await signIn(formData);
      setUser(response.data.user);
      msgAlert({
        heading: "Sign Up Success",
        message: messages.signUpSuccess,
        variant: "success",
      });
      navigate("/threads");
    } catch (error) {
      setLoading(false);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        username: "",
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
    <div className="sign-up-container">
      <div className="left-section">
        <img
          src={imageArray[currentImageIndex]}
          alt="Stock chart"
          className="chart-image"
        />
      </div>
      <div className="right-section">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="sign-up-form">
          <h3 className="sign-up--title">Create an Account</h3>
          <Form className="sign-up--form" onSubmit={onSignUp}>
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

            <Form.Group controlId="username">
              <Form.Label>User Name</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  required
                  type="username"
                  name="username"
                  value={formData.username}
                  placeholder="Enter your User Name"
                  onChange={handleChange}
                  style={{
                    backgroundColor: usernameIsValid ? "" : "#ffc9c9", // Highlight red if invalid
                  }}
                />
                {usernameIsValid && formData.username.length > 0 && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="check-icon"
                    style={{ color: "green" }}
                  />
                )}
              </div>
              {!usernameIsValid && formData.username.length > 0 && (
                <Form.Text className="text-danger">
                  Min 5 characters, min 1 number, no space, no speacial
                  character
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
                    backgroundColor: passwordConfirmationIsValid
                      ? ""
                      : "#ffc9c9",
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
            <Button className="sign-up--btn" type="submit">
              {loading ? <DotsLoader /> : "Sign Up"}
            </Button>
            <div className="navigate-sign-in">
              <p className="have-account">Have an account?</p>
              <Nav.Link className="navigate--sign-in" href="#sign-in">
                Sign In
              </Nav.Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default adminSignUp;
