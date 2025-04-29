// src/components/EventForm.jsx
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { apiEvents } from "../Auth_api.js";

export default function EventForm({ initialData = null, onSuccess, onCancel }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
  });
  const [image, setImage] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        start_date: initialData.start_date.slice(0, 16),
        end_date: initialData.end_date?.slice(0, 16) || "",
      });
      setTiers(initialData.ticket_tiers);
      setSpeakers(initialData.speakers);
      setSponsors(initialData.sponsors);
      setItems(initialData.program_items);
    }
  }, [initialData]);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleImage = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);
    data.append("ticket_tiers", JSON.stringify(tiers));
    data.append("speakers", JSON.stringify(speakers));
    data.append("sponsors", JSON.stringify(sponsors));
    data.append("program_items", JSON.stringify(items));

    try {
      const method = isEdit ? apiEvents.patch : apiEvents.post;
      const url = isEdit ? `/${initialData.id}/` : "/";
      const res = await method(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Помилка");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      sx={{ p: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        {isEdit ? "Редагувати подію" : "Нова подія"}
      </Typography>
      <TextField
        label="Назва"
        name="title"
        fullWidth
        margin="normal"
        value={form.title}
        onChange={handle("title")}
        required
      />
      <TextField
        label="Опис"
        name="description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={form.description}
        onChange={handle("description")}
        required
      />
      <TextField
        label="Локація"
        name="location"
        fullWidth
        margin="normal"
        value={form.location}
        onChange={handle("location")}
      />
      <TextField
        label="Початок"
        name="start_date"
        type="datetime-local"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={form.start_date}
        onChange={handle("start_date")}
        required
      />
      <TextField
        label="Кінець"
        name="end_date"
        type="datetime-local"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={form.end_date}
        onChange={handle("end_date")}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" component="label">
          Змінити зображення
          <input type="file" hidden accept="image/*" onChange={handleImage} />
        </Button>
      </Box>

      {/* Тут можно «кнопками и списками» вызывать ваши модалки для тарифів, спікерів и т.д. */}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Відмінити</Button>
        <Button type="submit" variant="contained">
          {isEdit ? "Зберегти" : "Створити"}
        </Button>
      </Box>
    </Box>
  );
}
