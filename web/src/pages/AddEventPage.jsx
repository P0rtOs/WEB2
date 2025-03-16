import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { createEvent } from "../Auth_api";

const EventCreationForm = () => {
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

  // Обработчик для базовых полей события
  const handleEventFormChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Динамические списки для Ticket Tiers
  const addTicketTier = () => {
    setTicketTiers([
      ...ticketTiers,
      { title: "", description: "", price: "", ticket_type: "paid" },
    ]);
  };
  const updateTicketTier = (index, field, value) => {
    const newTiers = [...ticketTiers];
    newTiers[index][field] = value;
    setTicketTiers(newTiers);
  };
  const removeTicketTier = (index) => {
    const newTiers = [...ticketTiers];
    newTiers.splice(index, 1);
    setTicketTiers(newTiers);
  };

  // Динамический список для Speakers
  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", bio: "" }]);
  };
  const updateSpeaker = (index, field, value) => {
    const newSpeakers = [...speakers];
    newSpeakers[index][field] = value;
    setSpeakers(newSpeakers);
  };
  const removeSpeaker = (index) => {
    const newSpeakers = [...speakers];
    newSpeakers.splice(index, 1);
    setSpeakers(newSpeakers);
  };

  // Динамический список для Sponsors
  const addSponsor = () => {
    setSponsors([...sponsors, { name: "", website: "" }]);
  };
  const updateSponsor = (index, field, value) => {
    const newSponsors = [...sponsors];
    newSponsors[index][field] = value;
    setSponsors(newSponsors);
  };
  const removeSponsor = (index) => {
    const newSponsors = [...sponsors];
    newSponsors.splice(index, 1);
    setSponsors(newSponsors);
  };

  // Динамический список для Program Items
  const addProgramItem = () => {
    setProgramItems([
      ...programItems,
      { title: "", description: "", start_time: "", end_time: "" },
    ]);
  };
  const updateProgramItem = (index, field, value) => {
    const newProgramItems = [...programItems];
    newProgramItems[index][field] = value;
    setProgramItems(newProgramItems);
  };
  const removeProgramItem = (index) => {
    const newProgramItems = [...programItems];
    newProgramItems.splice(index, 1);
    setProgramItems(newProgramItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Собираем данные в FormData
    const data = new FormData();
    data.append("title", eventForm.title);
    data.append("description", eventForm.description);
    data.append("location", eventForm.location);
    data.append("start_date", eventForm.start_date);
    data.append("end_date", eventForm.end_date);
    if (image) data.append("image", image);
    // Сериализуем вложенные массивы
    data.append("ticket_tiers", JSON.stringify(ticketTiers));
    data.append("speakers", JSON.stringify(speakers));
    data.append("sponsors", JSON.stringify(sponsors));
    data.append("program_items", JSON.stringify(programItems));

    try {
      await createEvent(data);
      setSuccess("Event created successfully!");
      setTimeout(() => navigate("/events"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Error creating event."
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Event
        </Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Основные поля */}
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={eventForm.title}
            onChange={handleEventFormChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={eventForm.description}
            onChange={handleEventFormChange}
            required
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            margin="normal"
            value={eventForm.location}
            onChange={handleEventFormChange}
            required
          />
          <TextField
            label="Start Date"
            name="start_date"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={eventForm.start_date}
            onChange={handleEventFormChange}
            required
          />
          <TextField
            label="End Date"
            name="end_date"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={eventForm.end_date}
            onChange={handleEventFormChange}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Upload Image</Typography>
            <Button variant="contained" component="label">
              Choose File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {/* Ticket Tiers */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Ticket Tiers</Typography>
            {ticketTiers.map((tier, index) => (
              <Card key={index} sx={{ my: 2, p: 2 }}>
                <CardContent>
                  <TextField
                    label="Tier Title"
                    fullWidth
                    margin="normal"
                    value={tier.title}
                    onChange={(e) =>
                      updateTicketTier(index, "title", e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Tier Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={tier.description}
                    onChange={(e) =>
                      updateTicketTier(index, "description", e.target.value)
                    }
                  />
                  <TextField
                    label="Price"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={tier.price}
                    onChange={(e) =>
                      updateTicketTier(index, "price", e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Ticket Type"
                    fullWidth
                    margin="normal"
                    value={tier.ticket_type}
                    onChange={(e) =>
                      updateTicketTier(index, "ticket_type", e.target.value)
                    }
                    required
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeTicketTier(index)}
                  >
                    Remove Tier
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Button variant="outlined" onClick={addTicketTier}>
              Add Ticket Tier
            </Button>
          </Box>

          {/* Speakers */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Speakers</Typography>
            {speakers.map((speaker, index) => (
              <Card key={index} sx={{ my: 2, p: 2 }}>
                <CardContent>
                  <TextField
                    label="Speaker Name"
                    fullWidth
                    margin="normal"
                    value={speaker.name}
                    onChange={(e) =>
                      updateSpeaker(index, "name", e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Bio"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={speaker.bio}
                    onChange={(e) =>
                      updateSpeaker(index, "bio", e.target.value)
                    }
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeSpeaker(index)}
                  >
                    Remove Speaker
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Button variant="outlined" onClick={addSpeaker}>
              Add Speaker
            </Button>
          </Box>

          {/* Sponsors */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Sponsors</Typography>
            {sponsors.map((sponsor, index) => (
              <Card key={index} sx={{ my: 2, p: 2 }}>
                <CardContent>
                  <TextField
                    label="Sponsor Name"
                    fullWidth
                    margin="normal"
                    value={sponsor.name}
                    onChange={(e) =>
                      updateSponsor(index, "name", e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Website"
                    fullWidth
                    margin="normal"
                    value={sponsor.website}
                    onChange={(e) =>
                      updateSponsor(index, "website", e.target.value)
                    }
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeSponsor(index)}
                  >
                    Remove Sponsor
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Button variant="outlined" onClick={addSponsor}>
              Add Sponsor
            </Button>
          </Box>

          {/* Program Items */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Program Items</Typography>
            {programItems.map((item, index) => (
              <Card key={index} sx={{ my: 2, p: 2 }}>
                <CardContent>
                  <TextField
                    label="Program Title"
                    fullWidth
                    margin="normal"
                    value={item.title}
                    onChange={(e) =>
                      updateProgramItem(index, "title", e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      updateProgramItem(index, "description", e.target.value)
                    }
                  />
                  <TextField
                    label="Start Time"
                    fullWidth
                    margin="normal"
                    type="time"
                    value={item.start_time}
                    onChange={(e) =>
                      updateProgramItem(index, "start_time", e.target.value)
                    }
                  />
                  <TextField
                    label="End Time"
                    fullWidth
                    margin="normal"
                    type="time"
                    value={item.end_time}
                    onChange={(e) =>
                      updateProgramItem(index, "end_time", e.target.value)
                    }
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeProgramItem(index)}
                  >
                    Remove Program Item
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Button variant="outlined" onClick={addProgramItem}>
              Add Program Item
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
            Create Event
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EventCreationForm;
