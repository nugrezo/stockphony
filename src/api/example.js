import apiUrl from "../apiConfig";
import axios from "axios";

export const createExample = (example, user) => {
  return axios({
    method: "POST",
    url: apiUrl + "/example",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      example: {
        text: example.text,
      },
    },
  });
};

export const getAllExamples = (user) => {
  return axios({
    url: apiUrl + "/example",
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const deleteExample = (user, id) => {
  return axios({
    url: apiUrl + "/example/" + id,
    method: "DELETE",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const updateExample = (example, user, id) => {
  return axios({
    url: apiUrl + "/examples/" + id,
    method: "PATCH",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      example: {
        text: example.text,
      },
    },
  });
};

export const showExample = (user, id) => {
  return axios({
    url: apiUrl + "/examples/" + id,
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const createCommentExample = (comment, user, id) => {
  return axios({
    url: apiUrl + "/examples/" + id + "/comment",
    method: "POST",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      comment: {
        text: comment.text,
      },
    },
  });
};

export const toggleLikeExample = (user, id) => {
  return axios({
    url: apiUrl + "/examples/" + id + "/like",
    method: "POST",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};
