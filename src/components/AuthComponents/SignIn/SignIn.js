import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./SignIn.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signIn } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
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
    <div className="sign-in-container">
      <div className="left-section">
        <div className="sign-in-form">
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
            <div className="navigate-sign-up">
              <p className="have-account">Do not have an account?</p>
              <Nav.Link className="navigate--sign-up" href="#sign-up">
                Sign Up
              </Nav.Link>
            </div>
          </Form>
        </div>
      </div>
      <div className="right-section">
        <div className="circle circle1 small"></div>
        <div className="circle circle2 medium"></div>
        <div className="circle circle3 medium"></div>
        <div className="circle circle4 large"></div>
        <div className="circle circle5 small"></div>
        <div className="circle circle6 medium"></div>
        <div className="circle circle7 small"></div>
        <div className="circle circle8 large"></div>
        <div className="circle circle9 medium"></div>
        <div className="circle circle10 small"></div>
        <div className="circle circle11 large"></div>
        <div className="circle circle12 medium"></div>
        <div className="circle circle13 small"></div>
        <div className="circle circle14 large"></div>
        <div className="circle circle15 medium"></div>
        <div className="circle circle16 small"></div>
        <div className="circle circle17 large"></div>
        <div className="circle circle18 small"></div>
        <div className="circle circle19 medium"></div>
        <div className="circle circle20 large"></div>
      </div>
    </div>
  );
};

export default SignIn;
