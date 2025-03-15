// C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/web/src/components/EventCard.jsx
import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Определяем минимальную цену из тиров
  const getMinPrice = () => {
    if (!event.ticket_tiers || event.ticket_tiers.length === 0) return "N/A";
    const prices = event.ticket_tiers.map((tier) => parseFloat(tier.price));
    return Math.min(...prices).toFixed(2);
  };

  // Обрезаем описание до, например, 100 символов
  const truncatedDescription =
    event.description.length > 100
      ? event.description.substring(0, 100) + "..."
      : event.description;

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardActionArea onClick={() => navigate(`/events/${event.id}`)}>
        {event.image && (
          <CardMedia
            component="img"
            height="140"
            image={event.image}
            alt={event.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {truncatedDescription}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="primary">
              Від {getMinPrice()} грн.
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
