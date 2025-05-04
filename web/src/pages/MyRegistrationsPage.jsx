// src/pages/MyRegistrationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { apiEvents } from "../Auth_api.js";

const drawerWidth = 240;

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiEvents
      .get("/my-registrations/")
      .then((res) => setRegistrations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Sidebar />
      <Container sx={{ mt: 4, pl: `${drawerWidth}px` }}>
        <Typography variant="h4" gutterBottom>
          Мої квитки
        </Typography>
        <Grid container spacing={2}>
          {registrations.map((reg) => {
            const event = reg.event;
            const description =
              event.description.length > 120
                ? event.description.slice(0, 120) + "..."
                : event.description;
            return (
              <Grid item xs={12} sm={6} md={4} key={reg.id}>
                <Card>
                  <CardActionArea>
                    {event.image && (
                      <CardMedia
                        component="img"
                        image={event.image}
                        alt={event.title}
                        height={140}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {description}
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => alert("QR генератор (заглушка)")}
                        >
                          Сгенерувати QR квиток
                        </Button>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
