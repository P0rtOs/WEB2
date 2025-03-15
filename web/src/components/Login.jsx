// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser, getUserType } from "../Auth_api.js";
import GoogleAuth from "./GoogleAuth.jsx";
import { useDispatch } from "react-redux";
import { setUserRole } from "../features/authSlice";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "ivabobula136@gmail.com",
    password: "Hatsune_Miku",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialLoginSuccess = async (data) => {
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    const role = await getUserType();
    dispatch(setUserRole(role));
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(formData.email, formData.password);
      const role = await getUserType();
      dispatch(setUserRole(role));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Login
          </Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <GoogleAuth onLoginSuccess={handleSocialLoginSuccess} />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
