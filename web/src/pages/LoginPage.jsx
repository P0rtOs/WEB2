import React from "react";
import Login from "../components/Login.jsx"; // Імпортуємо компонент Login
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Login.css"; // Додаємо CSS-файл

const LoginPage = () => {
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
