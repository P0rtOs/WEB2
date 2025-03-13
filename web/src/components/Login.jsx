import React, { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../Auth_api.js";
import GoogleAuth from "./GoogleAuth.jsx";
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

  const handleSocialLoginSuccess = (data) => {
    // Example: Save JWT tokens in localStorage
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    // Redirect or update your application state as needed.
    window.location.href = "/";
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
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      <GoogleAuth onLoginSuccess={handleSocialLoginSuccess} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
