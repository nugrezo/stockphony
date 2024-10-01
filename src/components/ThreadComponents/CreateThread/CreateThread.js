import React, { useState } from "react";
import "./CreateThread.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { createThread } from "../../../api/thread";
import messages from "../../AutoDismissAlert/messages";
import Icon from "../Icon/Icon";

const CreateThread = ({ msgAlert, user }) => {
  const [formData, setFormData] = useState({
    text: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      return newData;
    });
  };

  const onCreateThread = async (event) => {
    event.preventDefault();

    try {
      await createThread(formData, user);
      setFormData({
        text: "",
      });
      msgAlert({
        heading: "Created successfully",
        message: messages.createThreadSucess,
        variant: "success",
      });
    } catch (error) {
      msgAlert({
        heading: "Create Thread Failed with error: " + error.message,
        message: messages.signUpFailure,
        variant: "danger",
      });
    }
  };

  return (
    <>
      {user && <Icon />}
      {user && (
        <div className="create-thread-container">
          <div className="create-thread-form col-sm-10 col-md-8 mx-auto mt-5">
            <Form className="create-thread--form" onSubmit={onCreateThread}>
              <Form.Group className="create-thread--input" controlId="thread">
                <Form.Control
                  className="create-thread--input"
                  required
                  type="text"
                  name="text"
                  value={formData.text}
                  placeholder="What's on your mind?"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                className="create-thread--btn"
                variant="primary"
                type="submit"
              >
                Post
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateThread;
