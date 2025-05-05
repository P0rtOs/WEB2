import React from "react";
import "../css/event_card.scss"

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
    <Card className="event-card">
      <CardActionArea
        onClick={() => navigate(`/events/${event.id}`)}
        className="event-action-area"
      >
        {event.image && (
          <CardMedia
            component="img"
            image={event.image}
            alt={event.title}
            className="event-image"
          />
        )}
        <CardContent className="event-content">
          <Typography variant="h5" gutterBottom>
            {event.title}
          </Typography>

          <Box className="event-description">
            <Typography variant="body2" color="text.secondary">
              {truncatedDescription}
            </Typography>
          </Box>

          <Box className="event-info">
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
