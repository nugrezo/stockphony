import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./SignUp.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signIn, signUp } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
import DotsLoader from "../../DotsLoader/DotsLoader";

const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S{2,}$/;
  const isValidFormat = emailRegex.test(email);

  if (isValidFormat) {
    const validDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      "aol.com",
      "hotmail.co.uk",
      "hotmail.fr",
      "msn.com",
      "yahoo.fr",
      "wanadoo.fr",
      "orange.fr",
      "yahoo.co.uk",
      "ahoo.com.br",
      "live.com",
      "yandex.ru",
      "googlemail.com",
      "yahoo.de",
    ];
    const domain = email.split("@")[1].toLowerCase();

    return validDomains.includes(domain);
  } else {
    return false;
  }
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return passwordRegex.test(password);
};

const SignUp = ({ msgAlert, setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [passwordConfirmationIsValid, setPasswordConfirmationIsValid] =
    useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      setEmailIsValid(validateEmail(value));
    } else if (name === "password") {
      setPasswordIsValid(validatePassword(value));
    } else if (name === "passwordConfirmation") {
      if (value === formData.password) {
        setPasswordConfirmationIsValid(true);
      } else {
        setPasswordConfirmationIsValid(false);
      }
    }
  };

  const onSignUp = async (event) => {
    event.preventDefault();
    if (!emailIsValid || !passwordIsValid) {
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

  const passwordConditionStyle = (isValid, password) => ({
    color:
      isValid || (password && password.length >= 8) ? "green" : "lightcoral",
  });

  return (
    <div className="row">
      <div className="sign-up-form col-sm-10 col-md-8 mx-auto">
        <h3 className="sign-up--title">Create an Account</h3>
        <Form className="sign-up--form" onSubmit={onSignUp}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
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
            {!emailIsValid && (
              <Form.Text className="text-danger">
                Invalid email format
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              required
              type="username"
              name="username"
              value={formData.username}
              placeholder="Enter your User Name"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
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
            {!passwordIsValid && (
              <Form.Text className="text-danger">
                <ul>
                  <li
                    style={passwordConditionStyle(
                      validatePassword(formData.password),
                      formData.password
                    )}
                  >
                    min 8 characters
                  </li>

                  <li
                    style={passwordConditionStyle(
                      /[A-Z]/.test(formData.password)
                    )}
                  >
                    min 1 uppercase letter
                  </li>
                  <li
                    style={passwordConditionStyle(
                      /[a-z]/.test(formData.password)
                    )}
                  >
                    min 1 lowercase letter
                  </li>
                  <li
                    style={passwordConditionStyle(
                      /[0-9]/.test(formData.password)
                    )}
                  >
                    min 1 number
                  </li>
                  <li
                    style={passwordConditionStyle(
                      /[!@#$%^&*]/.test(formData.password)
                    )}
                  >
                    min 1 special character (!@#$%^&*)
                  </li>
                </ul>
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="passwordConfirmation">
            <Form.Label>Password Confirmation</Form.Label>
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
  );
};

export default SignUp;
