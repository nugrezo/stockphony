import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./SignIn.css";

import { signIn } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DotsLoader from "../../DotsLoader/DotsLoader";

const SignIn = ({ msgAlert, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  const onSignIn = (event) => {
    event.preventDefault();
    setLoading(true);
    signIn(formData)
      .then((res) => setUser(res.data.user))
      .then(() =>
        msgAlert({
          heading: "Sign In Success",
          message: messages.signInSuccess,
          variant: "success",
        })
      )
      .then(() => navigate("/threads"))
      .catch((error) => {
        setLoading(false);
        setFormData({
          email: "",
          password: "",
        });
        msgAlert({
          heading: "Sign In Failed with error: " + error.message,
          message: messages.signInFailure,
          variant: "danger",
        });
      });
  };

  const { email, password } = formData;

  return (
    <div className="row">
      <div className="sign-in-form col-sm-10 col-md-8 mx-auto mt-5">
        <h3 className="sign-in--title">Sign In to your Account</h3>
        <Form className="sign-in--form" onSubmit={onSignIn}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              name="password"
              value={password}
              type="password"
              placeholder="Enter your Password"
              onChange={handleChange}
            />
          </Form.Group>
          <Button className="sign-in--btn" type="submit">
            {loading ? <DotsLoader /> : "Sign In"}
          </Button>
          <div className="navigate-sign-in">
            <p className="have-account">Do not have an account?</p>
            <Nav.Link className="navigate--sign-in" href="#sign-up">
              Sign Up
            </Nav.Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
