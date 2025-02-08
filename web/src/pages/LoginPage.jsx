import React, { useState } from "react";
import Login from "../components/Login.jsx";
import { useNavigate } from "react-router";
import { loginUser } from "../Auth_api.js";
import "../css/Login.scss";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "ivabobula136@gmail.com",
    password: "Hatsune_Miku",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
