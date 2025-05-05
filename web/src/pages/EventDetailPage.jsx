// src/pages/EventDetailPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar.jsx";
import EventForm from "../components/EventForm";
import { apiEvents } from "../Auth_api.js";

const drawerWidth = 240;

function BuyTicketModal({ open, onClose, ticketTiers, onPurchase }) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [error, setError] = useState("");

  const handleSelect = (e) =>
    setSelectedTier(ticketTiers.find((t) => t.id === parseInt(e.target.value)));
  const handlePay = () => {
    if (!selectedTier) {
      setError("Оберіть тариф");
      return;
    }
    onPurchase(selectedTier);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Купити квиток</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Оберіть тариф</Typography>
        <RadioGroup
          onChange={handleSelect}
          value={selectedTier?.id?.toString() || ""}
        >
          {ticketTiers?.map((tier) => (
            <FormControlLabel
              key={tier.id}
              value={tier.id.toString()}
              control={<Radio />}
              label={`${tier.title} — ${parseFloat(tier.price).toFixed(2)} грн`}
            />
          ))}
        </RadioGroup>
        {selectedTier && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Опис тарифу</Typography>
            <Typography>{selectedTier.description}</Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Відмінити</Button>
        <Button variant="contained" onClick={handlePay}>
          Сплатити
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const isOrganizer =
    currentUser?.user_type === "organizer" &&
    event?.organizer === currentUser.id;
  const isAdmin = currentUser?.is_staff;

  // Определяем, может ли текущий пользователь редактировать событие
  // const currentUserIsOrganizer =
  //   currentUser?.user_type === "organizer" &&
  //   event?.organizer === currentUser.id;

  useEffect(() => {
    apiEvents
      .get(`/${id}/`)
      .then((res) => setEvent(res.data))
      .catch(console.error);
  }, [id]);

  const handlePurchase = (tier) => {
    apiEvents
      .post("/purchase/", { event_id: id, tier_id: tier.id })
      .then(() => {
        setBuyOpen(false);
        navigate("/events/my-registrations");
      })
      .catch((err) =>
        setPurchaseError(err.response?.data?.error || "Помилка покупки")
      );
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить событие?")) {
      try {
        await apiEvents.delete(`/${id}/`);
        navigate("/events");
      } catch (err) {
        console.error("Ошибка удаления:", err);
      }
    }
  };

  if (!event) return null;

  const tiers = event.ticket_tiers || [];

  return (
    <>
      <Sidebar />
      <Box component="main" sx={{ pt: 4, pl: `calc(${drawerWidth}px)` }}>
        {/* Event Image */}
        {event.image && (
          <Box sx={{ mb: 2 }}>
            <img
              src={event.image}
              alt={event.title}
              style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
            />
          </Box>
        )}
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>
        {/* Кнопки редактировать/удалить */}
        {(isOrganizer || isAdmin) && (
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={() => setEditOpen(true)}>
              Редактировать
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Удалить
            </Button>
          </Box>
        )}
        {/* Buy button */}
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setBuyOpen(true)}
        >
          Купити квиток
        </Button>
        {/* Description & Metadata */}
        <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
          <Box sx={{ flex: 2 }}>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            {/* Program */}
            {event.program_items?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Програма</Typography>
                {event.program_items.map((item) => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography>
                      <strong>
                        {item.start_time}–{item.end_time}
                      </strong>{" "}
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Chip
              label={`Від ${Math.min(
                ...tiers.map((t) => parseFloat(t.price))
              ).toFixed(2)} грн`}
            />
            <Typography>
              Дата: {new Date(event.start_date).toLocaleString()}
            </Typography>
            <Typography>Спікери:</Typography>
            {event.speakers?.map((s) => (
              <Typography key={s.id}>• {s.name}</Typography>
            ))}
            <Typography>Спонсори:</Typography>
            {event.sponsors?.map((s) => (
              <Typography key={s.id}>• {s.name}</Typography>
            ))}
            <Typography>
              Тип: {tiers.map((t) => t.ticket_type).join(", ")}
            </Typography>
            <Typography>Локація: {event.location}</Typography>
          </Box>
        </Box>
        {purchaseError && <Alert severity="error">{purchaseError}</Alert>}
      </Box>
      <BuyTicketModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        ticketTiers={tiers}
        onPurchase={handlePurchase}
      />

      {/* Модалка редактирования */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <EventForm
          initialData={event}
          onSuccess={(updated) => {
            setEvent(updated);
            setEditOpen(false);
          }}
          onCancel={() => setEditOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default EventDetailPage;
