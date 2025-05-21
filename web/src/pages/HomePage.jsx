// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import { apiEvents } from "../Auth_api";

const drawerWidth = 240;

const HomePage = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiEvents
      .get("/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Sidebar />

      <Container
        sx={{
          mt: 4,
          ml: `calc(${drawerWidth}px)`,
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Ласкаво просимо до платформи для управління подіями!
        </Typography>

        <Grid
          container
          justifyContent="center"
          spacing={2}
          sx={{ mb: 4, width: "100%" }}
        >
          <Grid item>
            <Button variant="contained" href="/register">
              Зареєструватися
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" href="/events">
              Переглянути події
            </Button>
          </Grid>
          {currentUser?.user_type === "organizer" && (
            <Grid item>
              <Button variant="contained" color="success" href="/add-event">
                Додати подію
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
