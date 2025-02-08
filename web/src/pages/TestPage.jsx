import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import JWT_Test from "../test_components/ProtectedTestButton.jsx";
import ToUser from "../test_components/ToUserButton.jsx";
import ToOrganizer from "../test_components/OrganizerButton.jsx";
import UserTypeCheck from "../test_components/CheckUserType.jsx";

const TestPage = () => {
    return (
        <div>
            <JWT_Test />
            <ToUser />
            <ToOrganizer />
            <UserTypeCheck />
        </div>
    );
};

export default TestPage;
