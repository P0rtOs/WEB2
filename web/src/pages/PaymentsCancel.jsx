import React from "react";
import { Typography, Container } from "@mui/material";

export default function PaymentsCancel() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Оплата отменена</Typography>
      <Typography>Попробуйте еще раз.</Typography>
    </Container>
  );
}
