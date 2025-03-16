// src/test_components/ToggleAdminButton.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdmin } from "../Auth_api";
import { setCurrentUser } from "../features/authSlice";
import { Button } from "@mui/material";

const ToggleAdminButton = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleToggle = async () => {
    try {
      const updatedUser = await toggleAdmin();
      dispatch(setCurrentUser(updatedUser));
    } catch (error) {
      console.error("Error toggling admin status", error);
    }
  };

  return (
    <Button variant="contained" onClick={handleToggle}>
      {currentUser && currentUser.is_staff ? "Revoke Admin" : "Become Admin"}
    </Button>
  );
};

export default ToggleAdminButton;
