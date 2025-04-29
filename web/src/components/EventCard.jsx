// src/components/EventCard.jsx
import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const getMinPrice = () => {
    if (!event.ticket_tiers?.length) return "N/A";
    const prices = event.ticket_tiers.map((t) => parseFloat(t.price));
    return Math.min(...prices).toFixed(2);
  };

  const truncatedDescription =
    event.description.length > 120
      ? event.description.slice(0, 120) + "..."
      : event.description;

  return (
    <Card sx={{ display: "flex", width: "100%", mb: 2 }}>
      <CardActionArea
        onClick={() => navigate(`/events/${event.id}`)}
        sx={{ display: "flex", alignItems: "stretch" }}
      >
        {event.image && (
          <CardMedia
            component="img"
            image={event.image}
            alt={event.title}
            sx={{ width: 200, objectFit: "cover" }}
          />
        )}
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Название */}
          <Typography variant="h5" gutterBottom>
            {event.title}
          </Typography>

          {/* Описание */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {truncatedDescription}
            </Typography>
          </Box>

          {/* Нижняя панель: спикер, время, цена */}
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            {event.speaker && <Chip label={event.speaker} size="small" />}
            {event.start_time && (
              <Chip
                label={new Date(event.start_time).toLocaleString()}
                size="small"
              />
            )}
            <Chip
              label={`Від ${getMinPrice()} грн`}
              color="primary"
              size="small"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
