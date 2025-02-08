import React, { useState } from "react";
import { useNavigate } from "react-router";
import { setUserType, authRequest } from "../Auth_api.js";

const BecomeOrganizerButton = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleBecomeOrganizer = async () => {
        try {
            await authRequest(async () => {
                await setUserType("organizer");
                setMessage("User is now an Organizer.");
            }, navigate);
        } catch (error) {
            setMessage("Failed to update user type: " + error.message);
        }
    };

    return (
        <button onClick={handleBecomeOrganizer} className="btn btn-success">
            Become Organizer
        </button>
    );
};

export default BecomeOrganizerButton;
