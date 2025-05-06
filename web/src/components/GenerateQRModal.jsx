// src/components/GenerateQRModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import { generateQR } from "../Auth_api";

export default function GenerateQRModal({
  open,
  onClose,
  registration,
  onDone,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    if (!name.trim()) {
      setError("Введите полное имя");
      return;
    }
    try {
      const updated = await generateQR(registration.id, name.trim());
      onDone(updated);
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Генерация QR-билета</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Полное Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleGenerate}>
          Сгенерировать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
