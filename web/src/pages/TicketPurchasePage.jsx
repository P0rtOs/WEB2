import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useParams } from "react-router";
import { apiEvents } from "../Auth_api";

const TicketPurchasePage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiEvents.get(`/${id}/`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const handlePurchase = async (tierId) => {
    await apiEvents.post("/purchase-ticket/", { ticket_tier: tierId });
  };

  if (!event) return <div>Loading...</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purchase Ticket for {event.title}
      </Typography>
      <Grid container spacing={2}>
        {event.ticket_tiers &&
          event.ticket_tiers.map((tier) => (
            <Grid item xs={12} sm={6} md={4} key={tier.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{tier.title}</Typography>
                  <Typography variant="body2">{tier.description}</Typography>
                  <Typography variant="subtitle1">
                    Price: {tier.price} грн
                  </Typography>
                  <Typography variant="body2">
                    Tickets Remaining: {tier.tickets_remaining}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handlePurchase(tier.id)}
                    >
                      Buy Ticket
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default TicketPurchasePage;
