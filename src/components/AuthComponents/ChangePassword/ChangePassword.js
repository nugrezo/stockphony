import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const ChangePassword = ({ msgAlert, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onChangePassword = (event) => {
    event.preventDefault();

    changePassword(formData, user)
      .then(() => {
        msgAlert({
          heading: "Change Password Success",
          message: messages.changePasswordSuccess,
          variant: "success",
        });
      })
      .then(() => navigate("/"))
      .catch((error) => {
        setFormData({ oldPassword: "", newPassword: "" });
        msgAlert({
          heading: "Change Password Failed with error: " + error.message,
          message: messages.changePasswordFailure,
          variant: "danger",
        });
      });
  };
  return (
    <div className="row">
      <div className="col-sm-10 col-md-8 mx-auto mt-5">
        <h3>Change Password</h3>
        <Form onSubmit={onChangePassword}>
          <Form.Group controlId="oldPassword">
            <Form.Label>Old password</Form.Label>
            <Form.Control
              required
              name="oldPassword"
              value={formData.oldPassword}
              type="password"
              placeholder="Old Password"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              required
              name="newPassword"
              value={formData.newPassword}
              type="password"
              placeholder="New Password"
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
