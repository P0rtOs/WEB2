// src/pages/TicketViewPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Box, Typography, Button, Alert } from "@mui/material";
import { apiEvents } from "../Auth_api";

export default function TicketViewPage() {
  const { id } = useParams();
  const [reg, setReg] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiEvents
      .get(`/tickets/${id}/view/`)
      .then((res) => setReg(res.data))
      .catch(() => setError("Білет не найдений, або помилка"));
  }, [id]);

  const markUsed = () => {
    apiEvents
      .post(`/my-registrations/${id}/mark-used/`)
      .then(() => setReg((r) => ({ ...r, used: true })))
      .catch(() => setError("Не вдалося відмітити"));
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!reg) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {reg.event.title}
      </Typography>
      <Typography>
        <strong>Участник:</strong> {reg.participant_name}
      </Typography>
      <Typography>
        <strong>Тариф:</strong> {reg.ticket_tier.title} —{" "}
        {reg.ticket_tier.price} грн
      </Typography>
      <Typography>
        <strong>Використано:</strong> {reg.used ? "Так" : "Ні"}
      </Typography>
      {!reg.used && (
        <Button
          variant="contained"
          color="secondary"
          onClick={markUsed}
          sx={{ mt: 2 }}
        >
          Відмітити як використане
        </Button>
      )}
    </Box>
  );
}
