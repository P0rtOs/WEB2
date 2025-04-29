import React from "react";
import EventList from "../components/EventList_Big";
import { Container, Button, Typography, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar"; // <-- вместо Header

const drawerWidth = 240;

const EventPage = ({ userRole }) => {
  const isAdmin = userRole === "admin";

  return (
    <>
      <Sidebar />
      <Container
        sx={{
          mt: 4,
          // ml: `${drawerWidth}px`, // сдвигаем вправо
        }}
      >
        <EventList isAdmin={isAdmin} />
      </Container>
    </>
  );
};

export default EventPage;
