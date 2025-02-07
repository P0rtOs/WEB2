import React, { useState } from "react";
import { useNavigate } from "react-router";
import { authRequest } from "../Auth_api.js";

const ProtectedButton = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            await authRequest(() => setMessage("ВСЕ ГУД"), navigate);
        } catch (error) {
            setMessage("НЕМА ТОКЕНА");
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Перевірити авторизацію</button>
            <p>{message}</p>
        </div>
    );
};

export default ProtectedButton;
