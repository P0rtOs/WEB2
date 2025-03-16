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
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { apiEvents } from "../Auth_api.js";
import { useSelector } from "react-redux";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Базовый URL уже указывает на /api/events, достаточно указать "/<id>/"
        const response = await apiEvents.get(`/${id}/`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      await apiEvents.delete(`/${event.id}/`);
      navigate("/events");
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  // Функция перехода на страницу покупки билета
  const handleBuyTicket = () => {
    navigate(`/purchase-ticket/${id}`);
  };

  // Кнопка удаления доступна для администратора или для организатора (создателя)
  const canDelete =
    event &&
    currentUser &&
    (currentUser.is_staff || currentUser.id === event.organizer);

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
          Место проведения: {event.location}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Даты проведения: {new Date(event.start_date).toLocaleString()}
          {event.end_date && ` - ${new Date(event.end_date).toLocaleString()}`}
        </Typography>
        {event.speakers && event.speakers.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Спикеры
            </Typography>
            {event.speakers.map((speaker) => (
              <Typography key={speaker.id} variant="body2">
                {speaker.name} — {speaker.bio}
              </Typography>
            ))}
          </Box>
        )}
        {event.sponsors && event.sponsors.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Спонсоры
            </Typography>
            {event.sponsors.map((sponsor) => (
              <Typography key={sponsor.id} variant="body2">
                {sponsor.name} — {sponsor.website}
              </Typography>
            ))}
          </Box>
        )}
        {event.program_items && event.program_items.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Программа
            </Typography>
            {event.program_items.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="body2">{item.description}</Typography>
                <Typography variant="caption">
                  {item.start_time} - {item.end_time}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Тиры квитків
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
                      <Typography variant="body2">
                        Осталося квитків: {tier.tickets_remaining}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleBuyTicket}>
            Купить билет
          </Button>
          {canDelete && (
            <Button variant="contained" color="error" onClick={handleDelete}>
              Видалити подію
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default EventDetailPage;
