import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getUserType } from "../Auth_api";

const UserTypeButton = () => {
  const [userType, setUserTypeState] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGetUserType = async () => {
    try {
      const type = await getUserType();
      setUserTypeState(type);
    } catch (err) {
      setError("Failed to retrieve user type: " + err.message);
      // Optionally, navigate to login on error:
      // navigate("/login");
    }
  };

  return (
    <div>
      <button onClick={handleGetUserType} className="btn btn-info">
        Get User Type
      </button>
      {userType && <p>User Type: {userType}</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default UserTypeButton;
