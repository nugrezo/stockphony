import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { adminSignOut } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";

const SignOut = ({ msgAlert, clearAdmin, admin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await adminSignOut(admin);
        msgAlert({
          heading: "Signed Out Successfully",
          message: messages.signOutSuccess,
          variant: "success",
        });
      } catch (error) {
        console.error("Sign Out failed with error:", error);
      } finally {
        navigate("/");
        clearAdmin();
      }
    };

    handleSignOut();
  }, [msgAlert, navigate, clearAdmin, admin]);

  return null;
};

export default SignOut;
