// src/pages/AddEventPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Sidebar from "../components/Sidebar";
import { apiEvents } from "../Auth_api.js";
import { useNavigate } from "react-router";

const drawerWidth = 240;

// ==== Modal Components ====

function TicketTierModal({ open, tier = {}, onClose, onSave }) {
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

function SpeakerModal({ open, speaker = {}, onClose, onSave }) {
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
            label="Ім’я спікера"
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

function SponsorModal({ open, sponsor = {}, onClose, onSave }) {
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
            label="Назва спонсора"
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

function ProgramItemModal({ open, item = {}, onClose, onSave }) {
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
        {item.title ? "Редагувати пункт програми" : "Новий пункт програми"}
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

// ==== Main Page ====

export default function AddEventPage() {
  const navigate = useNavigate();
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
  });
  const [image, setImage] = useState(null);
  const [ticketTiers, setTicketTiers] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [programItems, setProgramItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // modal states
  const [tierModal, setTierModal] = useState({ open: false, idx: null });
  const [speakerModal, setSpeakerModal] = useState({ open: false, idx: null });
  const [sponsorModal, setSponsorModal] = useState({ open: false, idx: null });
  const [progModal, setProgModal] = useState({ open: false, idx: null });

  const handleFormChange = (e) =>
    setEventForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleImage = (e) => setImage(e.target.files[0]);

  // add/save/remove helpers
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const data = new FormData();
    Object.entries(eventForm).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);
    data.append("ticket_tiers", JSON.stringify(ticketTiers));
    data.append("speakers", JSON.stringify(speakers));
    data.append("sponsors", JSON.stringify(sponsors));
    data.append("program_items", JSON.stringify(programItems));
    try {
      const res = await apiEvents.post("/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Событие создано!");
      setTimeout(() => navigate(`/events/${res.data.id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error");
    }
  };

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{ pt: 4, pl: `calc(${drawerWidth}px + 20rem)`, pr: "20rem" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Створити/Правка події
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Basic fields */}
          <TextField
            label="Назва"
            name="title"
            fullWidth
            margin="normal"
            value={eventForm.title}
            onChange={handleFormChange}
            required
          />
          <TextField
            label="Опис"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={eventForm.description}
            onChange={handleFormChange}
            required
          />
          <TextField
            label="Локація"
            name="location"
            fullWidth
            margin="normal"
            value={eventForm.location}
            onChange={handleFormChange}
          />
          <TextField
            label="Початок"
            name="start_date"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={eventForm.start_date}
            onChange={handleFormChange}
            required
          />
          <TextField
            label="Кінець"
            name="end_date"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={eventForm.end_date}
            onChange={handleFormChange}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              Завантажити зображення
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </Button>
          </Box>

          {/* --- Ticket Tiers --- */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Категорії квитків</Typography>
            <Button
              onClick={() => setTierModal({ open: true, idx: null })}
              sx={{ mt: 1 }}
            >
              Додати тариф
            </Button>
            {ticketTiers.map((t, i) => (
              <Box
                key={i}
                sx={{
                  mt: 2,
                  p: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography fontWeight="bold">{t.title}</Typography>
                  <Typography variant="body2">
                    Від {t.price} грн — {t.ticket_type}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setTierModal({ open: true, idx: i })}
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeItem(ticketTiers, setTicketTiers, i)}
                  >
                    Видалити
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* --- Speakers --- */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Спікери</Typography>
            <Button
              onClick={() => setSpeakerModal({ open: true, idx: null })}
              sx={{ mt: 1 }}
            >
              Додати спікера
            </Button>
            {speakers.map((s, i) => (
              <Box
                key={i}
                sx={{
                  mt: 2,
                  p: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>{s.name}</Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setSpeakerModal({ open: true, idx: i })}
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeItem(speakers, setSpeakers, i)}
                  >
                    Видалити
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* --- Sponsors --- */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Спонсори</Typography>
            <Button
              onClick={() => setSponsorModal({ open: true, idx: null })}
              sx={{ mt: 1 }}
            >
              Додати спонсора
            </Button>
            {sponsors.map((s, i) => (
              <Box
                key={i}
                sx={{
                  mt: 2,
                  p: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>{s.name}</Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setSponsorModal({ open: true, idx: i })}
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeItem(sponsors, setSponsors, i)}
                  >
                    Видалити
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* --- Program Items --- */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Програма</Typography>
            <Button
              onClick={() => setProgModal({ open: true, idx: null })}
              sx={{ mt: 1 }}
            >
              Додати пункт
            </Button>
            {programItems.map((p, i) => (
              <Box
                key={i}
                sx={{
                  mt: 2,
                  p: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>{p.title}</Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setProgModal({ open: true, idx: i })}
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeItem(programItems, setProgramItems, i)}
                  >
                    Видалити
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Зберегти подію
          </Button>
        </Box>
      </Box>

      {/* Modals */}
      <TicketTierModal
        open={tierModal.open}
        tier={ticketTiers[tierModal.idx] || {}}
        onClose={() => setTierModal((m) => ({ ...m, open: false }))}
        onSave={(d) => saveItem(ticketTiers, setTicketTiers, tierModal, d)}
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
        item={programItems[progModal.idx] || {}}
        onClose={() => setProgModal((m) => ({ ...m, open: false }))}
        onSave={(d) => saveItem(programItems, setProgramItems, progModal, d)}
      />
    </>
  );
}
