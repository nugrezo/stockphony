import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { adminSignOut } from "../../../api/auth";
import messages from "../../AutoDismissAlert/messages";

const AdminSignOut = ({ msgAlert, clearAdmin, admin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        console.log("Admin object before sign-out:", admin);
        await adminSignOut(admin);
        clearAdmin();
        msgAlert({
          heading: "Admin Signed Out Successfully",
          message: messages.signOutSuccess,
          variant: "success",
        });
      } catch (error) {
        console.error("Admin Sign Out failed with error:", error);
      } finally {
        navigate("/");
      }
    };

    handleSignOut();
  }, [msgAlert, navigate, clearAdmin, admin]);

  return null;
};

export default AdminSignOut;
