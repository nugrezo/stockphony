/* eslint-disable indent */
import React from "react";
import { Button, Form } from "react-bootstrap";
import { createCommentThread } from "../../../api/thread";
import messages from "../../AutoDismissAlert/messages";
import "./CreateCommentThread.css";

const CreateCommentThread = ({
  showModal,
  setShowModal,
  selectedThreadId,
  setThreads,
  setFormData,
  formData,
  user,
  msgAlert,
  navigate,
}) => {
  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevComment) => ({ ...prevComment, [name]: value }));
  };

  const onCreateCommentThread = async (event) => {
    event.preventDefault();

    try {
      await createCommentThread(formData, user, selectedThreadId);
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === selectedThreadId
            ? {
                ...thread,
                comments: [
                  ...thread.comments,
                  { ...formData, username: user.username },
                ],
              }
            : thread
        )
      );

      setFormData({ text: "" });
      setShowModal(false);

      msgAlert({
        // heading: "CREATE COMMENT SUCCESS",
        message: messages.createCommentSucess,
        variant: "success",
      });

      navigate("/threads");
    } catch (error) {
      msgAlert({
        heading: "Create Comment to Thread Failed with error: " + error.message,
        message: messages.createCommentFailure,
        variant: "danger",
      });
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Comment</h5>
                <Button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></Button>
              </div>
              <Form onSubmit={onCreateCommentThread}>
                <Form.Group className="form-comment">
                  <Form.Control
                    as="textarea"
                    placeholder="Enter your comment here..."
                    rows={5}
                    className="form-control"
                    name="text"
                    value={formData.text}
                    onChange={handleCommentChange}
                  />
                </Form.Group>
                <div className="modal-footer">
                  <Button type="submit" className="comment-add-btn">
                    Add
                  </Button>
                  <Button
                    type="button"
                    className="comment-cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCommentThread;
