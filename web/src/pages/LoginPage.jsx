import React, { useState } from "react";
import Login from "../components/Login.jsx";
import { useNavigate } from "react-router";
import { loginUser } from "../Auth_api";
import "../css/Login.scss";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "ivabobul1966@gmail.com",
    password: "HatsuneMiku",
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
      <Login />
    </div>
    // <div className="login-page">
    //   <div className="login-container">

    //   </div>
    // </div>
  );
};

export default LoginPage;
