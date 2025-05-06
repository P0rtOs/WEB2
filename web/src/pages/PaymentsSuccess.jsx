// src/pages/PaymentsSuccess.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router";
import { Typography, Container } from "@mui/material";

export default function PaymentsSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    console.log("Payment succeeded, session:", sessionId);
  }, [sessionId]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Оплата прошла успешно!</Typography>
      <Typography>Session ID: {sessionId}</Typography>
    </Container>
  );
}
