import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import JWT_Test from "../test_components/ProtectedTestButton.jsx";
import ToUser from "../test_components/ToUserButton.jsx";
import ToOrganizer from "../test_components/OrganizerButton.jsx";
import UserTypeCheck from "../test_components/CheckUserType.jsx";
import ToggleAdminButton from "../test_components/ToggleAdminButton";

const TestPage = () => {
  return (
    <div>
      <JWT_Test />
      <ToUser />
      <ToOrganizer />
      <UserTypeCheck />
      <ToggleAdminButton />
    </div>
  );
};

export default TestPage;
