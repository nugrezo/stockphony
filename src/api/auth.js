import apiUrl from "../apiConfig";
import axios from "axios";

export const signUp = (credentials) => {
  return axios({
    method: "POST",
    url: apiUrl + "/sign-up",
    data: {
      credentials: {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      },
    },
  });
};

export const signIn = (credentials) => {
  return axios({
    url: apiUrl + "/sign-in",
    method: "POST",
    data: {
      credentials: {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      },
    },
  });
};

export const signOut = (user) => {
  return axios({
    url: apiUrl + "/sign-out",
    method: "DELETE",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const changePassword = (passwords, user) => {
  return axios({
    url: apiUrl + "/change-password",
    method: "PATCH",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      passwords: {
        old: passwords.oldPassword,
        new: passwords.newPassword,
      },
    },
  });
};

export const userAccountInfo = (user, id) => {
  return axios({
    url: apiUrl + "/users/" + id,
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const changeUsername = (user, newUsername, id) => {
  return axios({
    url: apiUrl + "/change-username/" + id,
    method: "PATCH",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      username: newUsername,
    },
  });
};

export const changeEmail = (user, newEmail, id) => {
  return axios({
    url: apiUrl + "/change-email/" + id,
    method: "PATCH",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      email: newEmail,
    },
  });
};

// Inside uploadProfilePhoto function
export const uploadProfilePhoto = (imageUrl, user) => {
  return axios({
    url: apiUrl + "/upload-photo",
    method: "POST",
    headers: {
      Authorization: `Token token=${user.token}`,
      "Content-Type": "application/json", // Update content type
    },
    data: { imageUrl },
  });
};

// Inside getPhoto function
export const getProfilePhoto = (user) => {
  return axios({
    url: `${apiUrl}/get-photo`,
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const deleteProfilePhoto = (user) => {
  return axios({
    url: apiUrl + "/delete-photo",
    method: "DELETE",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};
