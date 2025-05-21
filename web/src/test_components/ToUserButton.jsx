import React, { useState } from "react";
import { useNavigate } from "react-router";
import { setUserType } from "../Auth_api";

const RevertToUserButton = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRevertUser = async () => {
    try {
      // Update user type to "client" (or "user" as appropriate)
      await setUserType("client");
      setMessage("User is now reverted to a standard user.");
    } catch (error) {
      setMessage("Failed to revert user type: " + error.message);
      // Optionally, navigate to login if unauthorized
      // navigate("/login");
    }
  };

  return (
    <button onClick={handleRevertUser} className="btn btn-warning">
      Become User
    </button>
  );
};

export default RevertToUserButton;
