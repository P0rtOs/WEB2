import React from "react";
import { Container, Button, Typography, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar"; // <-- вместо Header
import JWT_Test from "../test_components/ProtectedTestButton.jsx";
import ToUser from "../test_components/ToUserButton.jsx";
import ToOrganizer from "../test_components/OrganizerButton.jsx";
import UserTypeCheck from "../test_components/CheckUserType.jsx";
import ToggleAdminButton from "../test_components/ToggleAdminButton";
import TestDataGenerator from "../test_components/TestDataGenerate.jsx";
import Calendar from "../components/Calendar.jsx";
const drawerWidth = 240;

const TestPage = () => {
  return (
    <>
      <Sidebar />
      <Container
        sx={{
          mt: 4,
          ml: `${drawerWidth}px`, // сдвигаем вправо
        }}
      >
        <JWT_Test />
        <ToUser />
        <ToOrganizer />
        <UserTypeCheck />
        <ToggleAdminButton />
        <TestDataGenerator />
      </Container>
      < Calendar />
    </>
  );
};

export default TestPage;
