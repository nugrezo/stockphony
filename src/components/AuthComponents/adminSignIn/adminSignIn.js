import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./adminSignIn.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signIn } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";
import DotsLoader from "../../DotsLoader/DotsLoader";

const adminSignIn = ({ msgAlert, setUser }) => {
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

  const bubbles = Array.from({ length: 120 }, (_, index) => index + 1);

  const getRandomStyle = () => {
    const size = Math.floor(Math.random() * 50) + 20;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const animationDuration = `${Math.random() * 5 + 5}s`;

    return {
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}%`,
      left: `${left}%`,
      backgroundColor,
      animationDuration,
    };
  };

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
        {bubbles.map((bubble) => (
          <div key={bubble} className="circle" style={getRandomStyle()}></div>
        ))}
      </div>
    </div>
  );
};

export default adminSignIn;
