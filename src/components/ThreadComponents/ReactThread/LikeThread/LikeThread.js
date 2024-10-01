import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { toggleLikeThread } from "../../../../api/thread";
import "./LikeThread.css";
import messages from "../../../AutoDismissAlert/messages";

const LikeThread = ({ threadId, user, thread, setThreads, msgAlert }) => {
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    // Check if the initial thread like status is true
    const initialLikeStatus = thread.likes.some(
      (like) => like.likedBy === user._id
    );
    setIsLiked(initialLikeStatus);
  }, [thread, user._id]); // Include thread and user._id in the dependency array

  const handleLike = async () => {
    try {
      const response = await toggleLikeThread(user, threadId);

      // Check if the user has already liked the thread before toggling the like status
      const userLiked = response.data.likes.some(
        (like) => like.likedBy === user._id
      );

      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId
            ? { ...thread, likes: response.data.likes, userLiked }
            : thread
        )
      );

      if (userLiked) {
        msgAlert({
          // heading: "LIKE THREAD SUCCESS",
          message: messages.likeThreadSuccess,
          variant: "success",
        });
      } else {
        msgAlert({
          // heading: "UNLIKE THREAD SUCCESS",
          message: messages.unlikeThreadSuccess,
          variant: "danger",
        });
      }

      setIsLiked(userLiked);
    } catch (error) {
      msgAlert({
        heading: "Toggle Like Failed with error: " + error.message,
        message: "Failed to toggle like on thread.",
        variant: "danger",
      });
    }
  };

  return (
    <Button
      className={`like--btn ${isLiked ? "liked" : ""}`}
      variant={isLiked ? "success" : "primary"}
      onClick={handleLike}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="like-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
        />
      </svg>
    </Button>
  );
};

export default LikeThread;
