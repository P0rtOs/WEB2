// src/pages/MyRegistrationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import GenerateQRModal from "../components/GenerateQRModal.jsx";
import { apiEvents, openTicketPdf } from "../Auth_api.js";

const drawerWidth = 240;

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReg, setModalReg] = useState(null);

  useEffect(() => {
    apiEvents
      .get("/my-registrations/")
      .then((res) => setRegistrations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleQRDone = (updated) => {
    setRegistrations((regs) =>
      regs.map((r) => (r.id === updated.id ? updated : r))
    );
    setModalReg(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Sidebar />
      <Container sx={{ mt: 4, pl: `${drawerWidth}px` }}>
        <Typography variant="h4" gutterBottom>
          Мої квитки
        </Typography>
        <Grid container spacing={2}>
          {registrations.map((reg) => {
            const {
              event,
              qr_code_url,
              qr_holder_name,
              qr_generated_at,
              used,
            } = reg;

            return (
              <Grid item xs={12} sm={6} md={4} key={reg.id}>
                <Card>
                  {event.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={event.image}
                      alt={event.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {event.description.length > 100
                        ? event.description.slice(0, 100) + "..."
                        : event.description}
                    </Typography>

                    {qr_code_url ? (
                      <>
                        <Box sx={{ my: 2, textAlign: "center" }}>
                          <img
                            src={qr_code_url}
                            alt="QR код"
                            style={{ width: 120, height: 120 }}
                          />
                        </Box>
                        <Typography variant="body2">
                          Для: <strong>{qr_holder_name}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Сгенеровано:{" "}
                          {new Date(qr_generated_at).toLocaleString()}
                        </Typography>

                        {used ? (
                          // Если билет уже использован
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle1"
                              color="error"
                              align="center"
                            >
                              ВИКОРИСТАНО
                            </Typography>
                          </Box>
                        ) : (
                          // Иначе показываем кнопки Скачать/Отметить
                          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openTicketPdf(reg.id)}
                            >
                              Завантажити PDF
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                apiEvents
                                  .post(
                                    `/my-registrations/${reg.id}/mark-used/`
                                  )
                                  .then(() =>
                                    setRegistrations((rs) =>
                                      rs.map((r) =>
                                        r.id === reg.id
                                          ? { ...r, used: true }
                                          : r
                                      )
                                    )
                                  )
                              }
                            >
                              Позначити використаним
                            </Button>
                          </Box>
                        )}
                      </>
                    ) : (
                      // Ещё нет QR — показываем кнопку генерации
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setModalReg(reg)}
                      >
                        Сгенерувати QR-билет
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {modalReg && (
        <GenerateQRModal
          open
          registration={modalReg}
          onClose={() => setModalReg(null)}
          onDone={handleQRDone}
        />
      )}
    </>
  );
}
