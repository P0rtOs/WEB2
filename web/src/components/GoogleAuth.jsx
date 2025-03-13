// GoogleAuth.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleAuth = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    // The credential property contains the id_token.
    const idToken = credentialResponse.credential;

    try {
      // Send the Google id_token to your backend social login endpoint.
      // Adjust the URL according to your configuration.
      const response = await axios.post("http://127.0.0.1:8000/auth/google/", {
        token: idToken,
      });

      console.log("Backend social login response:", response.data);
      // onLoginSuccess is a callback to update your authentication state.
      onLoginSuccess(response.data);
    } catch (error) {
      console.error("Error during backend social login:", error);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleAuth;
