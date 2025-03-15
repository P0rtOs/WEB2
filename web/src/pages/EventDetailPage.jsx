// C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/web/src/pages/EventDetailPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import { useParams } from "react-router";
import { apiEvents } from "../Auth_api.js";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Так как базовый URL уже указывает на /api/events, достаточно указать "/<id>/"
        const response = await apiEvents.get(`/${id}/`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <Container sx={{ mt: 4 }}>
      {event.image && (
        <CardMedia
          component="img"
          height="300"
          image={event.image}
          alt={event.title}
        />
      )}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {event.description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Дати проведення: {new Date(event.start_date).toLocaleString()}
          {event.end_date && ` - ${new Date(event.end_date).toLocaleString()}`}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Тири квитків
          </Typography>
          <Grid container spacing={2}>
            {event.ticket_tiers &&
              event.ticket_tiers.map((tier) => (
                <Grid item xs={12} sm={6} md={4} key={tier.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{tier.title}</Typography>
                      <Typography variant="body2">
                        {tier.description}
                      </Typography>
                      <Typography variant="subtitle1">
                        Ціна: {tier.price} грн.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EventDetailPage;
