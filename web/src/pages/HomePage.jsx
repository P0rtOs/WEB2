// C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/web/src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { apiEvents } from "../Auth_api.js";

const HomePage = () => {
  const { role } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiEvents.get("/");
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Ласкаво просимо до платформи для управління подіями!
        </Typography>
        <Grid container justifyContent="center" spacing={2} sx={{ mb: 4 }}>
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
          {role === "organizer" && (
            <Grid item>
              <Button variant="contained" color="success" href="/add-event">
                Додати подію
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          {events.map((event) => (
            <Grid item key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
