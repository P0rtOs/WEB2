// src/pages/PaymentsSuccess.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Typography, Container, Box } from "@mui/material";

export default function PaymentsSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Payment succeeded, session:", sessionId);
    const timer = setTimeout(() => {
      navigate("/events/my-registrations");
    }, 3000);

    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Оплата пройшла успішно!
      </Typography>
      <Typography>Session ID: {sessionId}</Typography>
      <Box sx={{ mt: 2, color: "text.secondary" }}>
        Ви будете перенаправлені на сторінку «Мої квитки» через 3 секунди...
      </Box>
    </Container>
  );
}
