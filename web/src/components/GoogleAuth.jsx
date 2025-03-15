// GoogleAuth.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../Auth_api.js"; // импортируем нашу функцию

const GoogleAuth = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    const idToken = credentialResponse.credential;

    try {
      const responseData = await googleLogin(idToken);
      console.log("Backend social login response:", responseData);
      onLoginSuccess(responseData);
    } catch (error) {
      console.error("Error during backend social login:", error);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="google-auth-button">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleAuth;
