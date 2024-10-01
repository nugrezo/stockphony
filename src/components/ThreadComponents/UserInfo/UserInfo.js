import React, { useState, useEffect } from "react";
import "./UserInfo.css";
import Icon from "../Icon/Icon";
import {
  userAccountInfo,
  changeUsername,
  changeEmail,
  changePassword,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
} from "../../../api/auth";

import messages from "../../AutoDismissAlert/messages";
import { Modal, Button, Form } from "react-bootstrap";
import DotsLoader from "../../DotsLoader/DotsLoader";
import app from "../../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const UserInfo = ({ msgAlert, user }) => {
  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [passwordConfirmationIsValid, setPasswordConfirmationIsValid] =
    useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onUserInfo = async () => {
    try {
      const response = await userAccountInfo(user, user._id);
      const userAccountDataResponse = response.data.user;
      console.log("user account data is ", userAccountDataResponse);
      setUserInfo(userAccountDataResponse);
      setEditableUserInfo({
        username: userAccountDataResponse.username,
        email: userAccountDataResponse.email,
        oldPassword: "",
        newPassword: "",
      });
      msgAlert({
        message: messages.displayUserInfoSuccess,
        variant: "success",
      });
      setLoading(false);
    } catch (error) {
      msgAlert({
        heading: "Failed to fetch user information: " + error.message,
        message: messages.displayUserInfoFailure,
        variant: "danger",
      });
    }
  };

  useEffect(() => {
    onUserInfo();
  }, [user]);

  useEffect(() => {
    getProfileImage();
  }, []);

  const handleEditUserInfo = () => {
    setShowModal(true);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditableUserInfo({
      ...editableUserInfo,
      [name]: value,
    });

    if (name === "newPassword") {
      setPasswordIsValid(validatePassword(value));
    } else if (name === "confirmPassword") {
      if (value === editableUserInfo.newPassword) {
        setPasswordConfirmationIsValid(true);
      } else {
        setPasswordConfirmationIsValid(false);
      }
    }
  };

  const passwordConditionStyle = (isValid, password) => ({
    color:
      isValid || (password && password.length >= 8) ? "green" : "lightcoral",
  });

  const handleSaveChanges = async () => {
    try {
      // Validation checks for username and email
      if (!editableUserInfo.username.trim() || !editableUserInfo.email.trim()) {
        throw new Error("Fields cannot be blank");
      }

      if (!editableUserInfo.email.includes("@")) {
        throw new Error("Email must include @");
      }

      // Validation checks for password (if provided)
      if (editableUserInfo.newPassword.trim() !== "") {
        if (editableUserInfo.newPassword !== editableUserInfo.confirmPassword) {
          throw new Error("Passwords do not match");
        } else if (
          editableUserInfo.oldPassword === editableUserInfo.newPassword
        ) {
          throw new Error(
            "New Password must be different than your old password!"
          );
        }
      }

      // Update username and email
      await changeUsername(user, editableUserInfo.username, user._id);
      await changeEmail(user, editableUserInfo.email, user._id);

      // Update password if provided
      if (editableUserInfo.newPassword.trim() !== "") {
        await changePassword(
          {
            oldPassword: editableUserInfo.oldPassword,
            newPassword: editableUserInfo.newPassword,
          },
          user
        );
      }

      setUserInfo({
        ...userInfo,
        username: editableUserInfo.username,
        email: editableUserInfo.email,
      });
      setShowModal(false);

      setEditableUserInfo({
        ...editableUserInfo,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      msgAlert({
        message: messages.updateUserInfoSuccess,
        variant: "success",
      });
    } catch (error) {
      // Handle validation errors and other errors
      if (error.message === "Fields cannot be blank") {
        msgAlert({
          message: "Fields cannot be blank",
          variant: "danger",
        });
      } else if (error.message === "Email must include @") {
        msgAlert({
          message: "Email must include @",
          variant: "danger",
        });
      } else if (error.message === "Passwords do not match") {
        msgAlert({
          message: "Passwords do not match",
          variant: "danger",
        });
      } else {
        msgAlert({
          heading: "Failed to update user information: " + error.message,
          message: messages.updateUserInfoFailure,
          variant: "danger",
        });
      }
    }
  };

  const handleFileChange = async (e) => {
    const image = e.target.files[0];
    if (image) {
      try {
        setUploading(true);
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + image.name);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        setImageUrl(downloadURL);
        alert("DO NOT FORGET TO CLICK UPLOAD BUTTON");
      } catch (err) {
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!imageUrl) {
      msgAlert({
        heading: "No Image Selected",
        message: "Please select an image before uploading.",
        variant: "danger",
      });
      return;
    }

    try {
      await uploadProfilePhoto(imageUrl, user);
      getProfileImage();
      msgAlert({
        heading: "Photo Uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      msgAlert({
        heading: "Photo Upload Failed",
        variant: "danger",
      });
    }
  };

  const getProfileImage = async () => {
    try {
      const result = await getProfilePhoto(user);
      const photoUrl = result.data.photoUrl;
      setImageUrl(photoUrl);
    } catch (error) {}
  };

  const handleDeleteProfilePhoto = async () => {
    try {
      const response = await deleteProfilePhoto(user);
      console.log("delete photo response is ", response);
      setImageUrl("");
      document.getElementById("fileInput").value = "";
      msgAlert({
        heading: "Photo is deleteded successfully",
        variant: "success",
      });
    } catch (error) {}
  };

  return (
    <div>
      <Icon />
      {loading ? (
        <DotsLoader />
      ) : (
        <div className="user-info-header">Account Information</div>
      )}
      {loading ? (
        <DotsLoader />
      ) : (
        <div className="userinfo-container">
          <div className="user-info-content">
            <div className="user-info-wrapper">
              <div className="profilephoto-button-wrapper">
                <div
                  className="profilephoto-container"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {imageUrl ? (
                    <div>
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="fileInput"
                      />
                      <img src={imageUrl} className="user-profile-photo" />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="fileInput"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="profilephoto-icon_"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="profilephoto-buttons">
                  <button
                    disabled={uploading}
                    className="profilephoto-upload"
                    onClick={handleFileUpload}
                  >
                    Upload
                  </button>
                  <button
                    className="profilephoto-delete"
                    onClick={handleDeleteProfilePhoto}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="userinfo-item-container">
                <div className="user-info-item-container">
                  <div className="user-info-item-wrapper">
                    <div className="user-info-item">
                      <label className="user-info-label">User Name</label>
                      <span className="user-info-value">
                        {userInfo.username}
                      </span>
                    </div>
                    <div className="user-info-item">
                      <label className="user-info-label">Email</label>
                      <span className="user-info-value">{userInfo.email}</span>
                    </div>
                    <div className="user-info-item">
                      <label className="user-info-label">Password</label>
                      <span className="user-info-value">******</span>
                    </div>
                  </div>
                </div>
                <div className="user-info-edit-btn">
                  <Button className="edit-button" onClick={handleEditUserInfo}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editableUserInfo.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editableUserInfo.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={editableUserInfo.oldPassword}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={editableUserInfo.newPassword}
                onChange={handleInputChange}
                style={{
                  backgroundColor: passwordIsValid
                    ? "rgb(232, 240, 254)"
                    : "lightcoral",
                }}
              />
              {!passwordIsValid && (
                <Form.Text className="text-danger">
                  <ul>
                    <li
                      style={passwordConditionStyle(
                        validatePassword(editableUserInfo.newPassword),
                        editableUserInfo.newPassword
                      )}
                    >
                      min 8 characters
                    </li>

                    <li
                      style={passwordConditionStyle(
                        /[A-Z]/.test(editableUserInfo.newPassword)
                      )}
                    >
                      min 1 uppercase letter
                    </li>
                    <li
                      style={passwordConditionStyle(
                        /[a-z]/.test(editableUserInfo.newPassword)
                      )}
                    >
                      min 1 lowercase letter
                    </li>
                    <li
                      style={passwordConditionStyle(
                        /[0-9]/.test(editableUserInfo.newPassword)
                      )}
                    >
                      min 1 number
                    </li>
                    <li
                      style={passwordConditionStyle(
                        /[!@#$%^&*]/.test(editableUserInfo.newPassword)
                      )}
                    >
                      min 1 special character (!@#$%^&*)
                    </li>
                  </ul>
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={editableUserInfo.confirmPassword}
                onChange={handleInputChange}
                style={{
                  backgroundColor: passwordConfirmationIsValid
                    ? "rgb(232, 240, 254)"
                    : "lightcoral",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button
            className="modal-footer-btn save-changes-btn"
            variant="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
          <Button
            className="modal-footer-btn cancel-btn"
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserInfo;
