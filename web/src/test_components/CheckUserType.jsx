import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getUserType, authRequest } from "../Auth_api.js";

const UserTypeButton = () => {
    const [userType, setUserTypeState] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGetUserType = async () => {
        try {
            await authRequest(async () => {
                const type = await getUserType();
                setUserTypeState(type);
            }, navigate);
        } catch (err) {
            setError("Failed to retrieve user type: " + err.message);
        }
    };

    return (
        <div>
            <button onClick={handleGetUserType} className="btn btn-info">
                Get User Type
            </button>
            {userType && <p>User Type: {userType}</p>}
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default UserTypeButton;
