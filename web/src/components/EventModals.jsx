// src/components/EventModals.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
} from "@mui/material";

// Модалка для тарифов
export function TicketTierModal({ open, tier = {}, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    ticket_type: "paid",
    ...tier,
  });
  useEffect(
    () =>
      setForm({
        title: "",
        description: "",
        price: "",
        ticket_type: "paid",
        ...tier,
      }),
    [tier]
  );
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {tier.title ? "Редагувати тариф" : "Новий тариф"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Назва тарифу"
            value={form.title}
            onChange={handle("title")}
            fullWidth
          />
          <TextField
            label="Опис тарифу"
            value={form.description}
            onChange={handle("description")}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Ціна"
            value={form.price}
            onChange={handle("price")}
            fullWidth
            type="number"
          />
          <TextField
            label="Тип квитка"
            value={form.ticket_type}
            onChange={handle("ticket_type")}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Відмінити</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Модалка для спікера
export function SpeakerModal({ open, speaker = {}, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", bio: "", ...speaker });
  useEffect(() => setForm({ name: "", bio: "", ...speaker }), [speaker]);
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {speaker.name ? "Редагувати спікера" : "Новий спікер"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Ім’я"
            value={form.name}
            onChange={handle("name")}
            fullWidth
          />
          <TextField
            label="Біо"
            value={form.bio}
            onChange={handle("bio")}
            fullWidth
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Відмінити</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Модалка для спонсора
export function SponsorModal({ open, sponsor = {}, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", website: "", ...sponsor });
  useEffect(() => setForm({ name: "", website: "", ...sponsor }), [sponsor]);
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {sponsor.name ? "Редагувати спонсора" : "Новий спонсор"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Назва"
            value={form.name}
            onChange={handle("name")}
            fullWidth
          />
          <TextField
            label="Сайт"
            value={form.website}
            onChange={handle("website")}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Відмінити</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Модалка для пункту програми
export function ProgramItemModal({ open, item = {}, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    ...item,
  });
  useEffect(
    () =>
      setForm({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        ...item,
      }),
    [item]
  );
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {item.title ? "Редагувати пункт" : "Новий пункт програми"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Назва"
            value={form.title}
            onChange={handle("title")}
            fullWidth
          />
          <TextField
            label="Опис"
            value={form.description}
            onChange={handle("description")}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Час початку"
            value={form.start_time}
            onChange={handle("start_time")}
            type="time"
            fullWidth
          />
          <TextField
            label="Час кінця"
            value={form.end_time}
            onChange={handle("end_time")}
            type="time"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Відмінити</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
