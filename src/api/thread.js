import apiUrl from "../apiConfig";
import axios from "axios";

export const createThread = (thread, user) => {
  return axios({
    method: "POST",
    url: apiUrl + "/threads",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      thread: {
        text: thread.text,
      },
    },
  });
};

export const getAllThreads = (user) => {
  return axios({
    url: apiUrl + "/threads",
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const deleteThread = (user, id) => {
  return axios({
    url: apiUrl + "/threads/" + id,
    method: "DELETE",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const updateThread = (thread, user, id) => {
  return axios({
    url: apiUrl + "/threads/" + id,
    method: "PATCH",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    data: {
      thread: {
        text: thread.text,
      },
    },
  });
};

export const showThread = (user, id) => {
  return axios({
    url: apiUrl + "/threads/" + id,
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};

export const createCommentThread = (comment, user, id) => {
  return axios({
    url: apiUrl + "/threads/" + id + "/comment",
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

export const toggleLikeThread = (user, id) => {
  return axios({
    url: apiUrl + "/threads/" + id + "/like",
    method: "POST",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
  });
};
