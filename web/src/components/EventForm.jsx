// src/components/EventForm.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import {
  TicketTierModal,
  SpeakerModal,
  SponsorModal,
  ProgramItemModal,
} from "../components/EventModals";

import { apiEvents } from "../Auth_api.js";

export default function EventForm({ initialData = null, onSuccess, onCancel }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    event_type: "conference", // <— по умолчанию
  });

  const [image, setImage] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  // modal states
  const [tierModal, setTierModal] = useState({ open: false, idx: null });
  const [speakerModal, setSpeakerModal] = useState({ open: false, idx: null });
  const [sponsorModal, setSponsorModal] = useState({ open: false, idx: null });
  const [progModal, setProgModal] = useState({ open: false, idx: null });

  // helpers to add/update/remove items
  const saveItem = (arr, setArr, modal, data) => {
    setArr((prev) => {
      if (modal.idx === null) return [...prev, data];
      const copy = [...prev];
      copy[modal.idx] = data;
      return copy;
    });
  };
  const removeItem = (arr, setArr, idx) =>
    setArr((prev) => prev.filter((_, i) => i !== idx));

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        start_date: initialData.start_date.slice(0, 16),
        end_date: initialData.end_date?.slice(0, 16) || "",
        event_type: initialData.event_type, // <—
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
      <InputLabel id="event-type-label">Тип события</InputLabel>
      <Select
        labelId="event-type-label"
        label="Тип события"
        value={form.event_type}
        onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value }))}
      >
        <MenuItem value="conference">Conference</MenuItem>
        <MenuItem value="meetup">Meetup</MenuItem>
        <MenuItem value="webinar">Webinar</MenuItem>
        <MenuItem value="workshop">Workshop</MenuItem>
      </Select>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" component="label">
          Змінити зображення
          <input type="file" hidden accept="image/*" onChange={handleImage} />
        </Button>
      </Box>

      {/* Тут можно «кнопками и списками» вызывать ваши модалки для тарифів, спікерів и т.д. */}
      {/* Buttons to open modals */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setTierModal({ open: true, idx: null })}
        >
          Категорії квитків
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSpeakerModal({ open: true, idx: null })}
        >
          Спікери
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSponsorModal({ open: true, idx: null })}
        >
          Спонсори
        </Button>
        <Button
          variant="outlined"
          onClick={() => setProgModal({ open: true, idx: null })}
        >
          Програма
        </Button>
      </Box>

      {/* Display existing items */}
      {tiers.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Категорії квитків:</Typography>
          {tiers.map((t, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <Typography>
                {t.title} — {t.ticket_type} — {t.price}
              </Typography>
              <Button
                size="small"
                onClick={() => setTierModal({ open: true, idx: i })}
              >
                Редагувати
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => removeItem(tiers, setTiers, i)}
              >
                Видалити
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {speakers.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Спікери:</Typography>
          {speakers.map((s, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <Typography>{s.name}</Typography>
              <Button
                size="small"
                onClick={() => setSpeakerModal({ open: true, idx: i })}
              >
                Редагувати
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => removeItem(speakers, setSpeakers, i)}
              >
                Видалити
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {sponsors.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Спонсори:</Typography>
          {sponsors.map((sp, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <Typography>{sp.name}</Typography>
              <Button
                size="small"
                onClick={() => setSponsorModal({ open: true, idx: i })}
              >
                Редагувати
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => removeItem(sponsors, setSponsors, i)}
              >
                Видалити
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {items.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Програма:</Typography>
          {items.map((it, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <Typography>{it.title}</Typography>
              <Button
                size="small"
                onClick={() => setProgModal({ open: true, idx: i })}
              >
                Редагувати
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => removeItem(items, setItems, i)}
              >
                Видалити
              </Button>
            </Box>
          ))}
        </Box>
      )}

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
      {/* Modals */}
      <TicketTierModal
        open={tierModal.open}
        tier={tiers[tierModal.idx] || {}}
        onClose={() => setTierModal((m) => ({ ...m, open: false }))}
        onSave={(d) => saveItem(tiers, setTiers, tierModal, d)}
      />
      <SpeakerModal
        open={speakerModal.open}
        speaker={speakers[speakerModal.idx] || {}}
        onClose={() => setSpeakerModal((m) => ({ ...m, open: false }))}
        onSave={(d) => saveItem(speakers, setSpeakers, speakerModal, d)}
      />
      <SponsorModal
        open={sponsorModal.open}
        sponsor={sponsors[sponsorModal.idx] || {}}
        onClose={() => setSponsorModal((m) => ({ ...m, open: false }))}
        onSave={(d) => saveItem(sponsors, setSponsors, sponsorModal, d)}
      />
      <ProgramItemModal
        open={progModal.open}
        item={items[progModal.idx] || {}}
        onClose={() => setProgModal((m) => ({ ...m, open: false }))}
        onSave={(d) => saveItem(items, setItems, progModal, d)}
      />
    </Box>
  );
}
