import React, { useState, useEffect } from "react";
import "./ShowUserThreads.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { showThread, updateThread, deleteThread } from "../../../api/thread";
import messages from "../../AutoDismissAlert/messages";
import Icon from "../Icon/Icon";
import DotsLoader from "../../DotsLoader/DotsLoader";

const ShowUserThreads = ({ msgAlert, user }) => {
  const [userThreads, setUserThreads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [updatedText, setUpdatedText] = useState("");
  const [loading, setLoading] = useState(true);

  const onShowUserThreads = async () => {
    try {
      const response = await showThread(user, threadId);
      const filteredThreadsBasedOnOwner = response.data.threads.filter(
        (thread) => thread.owner === user._id
      );
      setUserThreads(filteredThreadsBasedOnOwner);
      setLoading(false);
      msgAlert({
        message: messages.displayUserThreadsSuccess,
        variant: "success",
      });
    } catch (error) {
      msgAlert({
        heading: "Create Thread Failed with error: " + error.message,
        message: messages.displayUserThreadsFailure,
        variant: "danger",
      });
    }
  };

  useEffect(() => {
    onShowUserThreads();
  }, [user]);

  const handleUpdate = (selectedThreadId) => {
    setShowModal(true);
    setThreadId(selectedThreadId);
    setUpdatedText(
      userThreads.find((thread) => thread._id === selectedThreadId)?.text || ""
    );
  };

  const handleDelete = (selectedThreadId) => {
    setShowDeleteModal(true);
    setThreadId(selectedThreadId);
  };

  const onUpdateThread = async () => {
    try {
      await updateThread({ text: updatedText }, user, threadId);

      const updatedThreads = userThreads.map((thread) =>
        thread._id === threadId ? { ...thread, text: updatedText } : thread
      );
      setUserThreads(updatedThreads);

      setShowModal(false);

      msgAlert({
        // heading: "UPDATE THREAD SUCCESS",
        message: messages.updateThreadSuccess,
        variant: "success",
      });
    } catch (error) {
      msgAlert({
        heading: "Update Thread Failed with error: " + error.message,
        message: messages.updateThreadFailure,
        variant: "danger",
      });
    }
  };

  const handleUpdateChange = (event) => {
    setUpdatedText(event.target.value);
  };

  const onDeleteUserThread = async (threadId) => {
    try {
      await deleteThread(user, threadId);

      const updatedThreads = userThreads.filter(
        (thread) => thread._id !== threadId
      );
      setUserThreads(updatedThreads);
      setShowDeleteModal(false);

      msgAlert({
        // heading: "DELETE THREAD SUCCESS",
        message: messages.deleteThreadSuccess,
        variant: "success",
      });
    } catch (error) {
      msgAlert({
        heading: "Delete Thread Failed with error: " + error.message,
        message: messages.deleteThreadFailure,
        variant: "danger",
      });
    }
  };
  return (
    <div
      className={`modal-background ${
        showModal || showDeleteModal ? "show" : ""
      }`}
    >
      {user && <Icon />}
      {loading ? (
        <DotsLoader />
      ) : (
        <div className="user-threads">
          <div className="user-threads--items col-sm-10 col-md-8 mx-auto mt-5">
            {userThreads.length > 0 ? (
              userThreads.map((userThread) => (
                <div className="user-threads--items-all" key={userThread._id}>
                  <div className="user-thread--item">
                    <div className="profilephoto-container-showuserthread">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </div>
                    <div className="user-threads--items-info">
                      <p className="user-threads--items-info-username">
                        {userThread.username}
                      </p>
                      <p className="user-threads--items-info-text">
                        {userThread.text}
                      </p>
                    </div>
                    <div className="react__container">
                      <Button
                        onClick={() => handleUpdate(userThread._id)}
                        className="edit-thread--btn"
                        variant="primary"
                        type="button"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(userThread._id)}
                        className="delete-thread--btn"
                        variant="primary"
                        type="button"
                      >
                        Delete
                      </Button>

                      {showModal && (
                        <div className="modal" style={{ display: "block" }}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Edit Thread</h5>
                                <Button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={() => setShowModal(false)}
                                ></Button>
                              </div>
                              <Form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  onUpdateThread();
                                }}
                              >
                                <Form.Group className="form-thread">
                                  <Form.Control
                                    as="textarea"
                                    placeholder="Enter your update thread"
                                    rows={5}
                                    className="form-control"
                                    name="text"
                                    value={updatedText}
                                    onChange={handleUpdateChange}
                                  />
                                </Form.Group>
                                <div className="modal-footer">
                                  <Button
                                    type="submit"
                                    className="update-thread-add-btn"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    className="update-thread-cancel-btn"
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
                      {showDeleteModal && (
                        <div className="modal" style={{ display: "block" }}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  Are you sure you want to delete the post!
                                </h5>
                                <Button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={() => setShowDeleteModal(false)}
                                ></Button>
                              </div>
                              <Form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  onDeleteUserThread(userThread._id);
                                }}
                              >
                                <Form.Group className="form-thread"></Form.Group>
                                <div className="modal-footer">
                                  <Button
                                    type="submit"
                                    className="update-thread-add-btn"
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    type="button"
                                    className="update-thread-cancel-btn"
                                    onClick={() => setShowDeleteModal(false)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="emptythread-message">
                You do not have any thread yet! Create one :))
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUserThreads;
