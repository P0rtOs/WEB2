import React from "react";
import Registration from "../components/Registration.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Registration.scss";

const RegistratePage = () => {
    return (
        <div className="regist-page">
            <div className="regist-container">
                <h2 className="regist-title">Registrate</h2>
                <Registration />
            </div>
        </div>
    );
};

export default RegistratePage;
