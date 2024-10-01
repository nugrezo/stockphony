import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";

const SignOut = ({ msgAlert, clearUser, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut(user);
        msgAlert({
          heading: "Signed Out Successfully",
          message: messages.signOutSuccess,
          variant: "success",
        });
      } catch (error) {
        console.error("Sign Out failed with error:", error);
      } finally {
        navigate("/");
        clearUser();
      }
    };

    handleSignOut();
  }, [msgAlert, navigate, clearUser, user]);

  return null;
};

export default SignOut;
