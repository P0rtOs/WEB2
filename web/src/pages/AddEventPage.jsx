// C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/web/src/pages/AddEventPage.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createEvent } from "../Auth_api.js";
import DeleteIcon from "@mui/icons-material/Delete";

const AddEventPage = () => {
  const userRole = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [ticketTiers, setTicketTiers] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (userRole === null) return <div>Загрузка...</div>;
  if (userRole !== "organizer")
    return (
      <Alert severity="error">
        Доступ заборонено: лише організатор може створювати події.
      </Alert>
    );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddTicketTier = () => {
    setTicketTiers([...ticketTiers, { title: "", description: "", price: "" }]);
  };

  const handleTicketTierChange = (index, field, value) => {
    const newTiers = [...ticketTiers];
    newTiers[index][field] = value;
    setTicketTiers(newTiers);
  };

  const handleRemoveTicketTier = (index) => {
    const newTiers = [...ticketTiers];
    newTiers.splice(index, 1);
    setTicketTiers(newTiers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Собираем данные в FormData, чтобы отправить файл
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    if (image) data.append("image", image);
    // Добавляем тиров билетов как JSON-строку
    data.append("ticket_tiers", JSON.stringify(ticketTiers));

    try {
      await createEvent(data);
      setSuccess("Подію створено успішно!");
      setTimeout(() => navigate("/events"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Сталася помилка при створенні події."
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Створити нову подію
        </Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Назва події"
            name="title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Опис події"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Дата початку"
            name="start_date"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date}
            onChange={handleChange}
            required
          />
          <TextField
            label="Дата завершення (необов'язково)"
            name="end_date"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.end_date}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Завантажити зображення</Typography>
            <Button variant="contained" component="label">
              Обрати файл
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {image && <Typography sx={{ mt: 1 }}>{image.name}</Typography>}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Тири квитків</Typography>
            {ticketTiers.map((tier, index) => (
              <Card key={index} sx={{ my: 2, p: 2 }}>
                <CardContent>
                  <TextField
                    label="Назва тиру"
                    fullWidth
                    margin="normal"
                    value={tier.title}
                    onChange={(e) =>
                      handleTicketTierChange(index, "title", e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Опис тиру"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={tier.description}
                    onChange={(e) =>
                      handleTicketTierChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                  <TextField
                    label="Ціна"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={tier.price}
                    onChange={(e) =>
                      handleTicketTierChange(index, "price", e.target.value)
                    }
                    required
                  />
                </CardContent>
                <CardActions>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveTicketTier(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
            <Button variant="outlined" onClick={handleAddTicketTier}>
              Додати тиру квитків
            </Button>
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
            Створити подію
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddEventPage;
