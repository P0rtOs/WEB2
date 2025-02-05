import React from "react";
import Login from "../components/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Login.scss";

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
