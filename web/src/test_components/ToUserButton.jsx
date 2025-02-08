import React, { useState } from "react";
import { useNavigate } from "react-router";
import { setUserType, authRequest } from "../Auth_api.js";

const RevertToUserButton = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRevertUser = async () => {
        try {
            await authRequest(async () => {
                await setUserType("client"); // або "user", залежно від твоєї логіки
                setMessage("User is now reverted to a standard user.");
            }, navigate);
        } catch (error) {
            setMessage("Failed to revert user type: " + error.message);
        }
    };

    return (
        <button onClick={handleRevertUser} className="btn btn-warning">
            Become User
        </button>
    );
};

export default RevertToUserButton;
