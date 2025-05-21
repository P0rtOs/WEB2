import React from "react";
import { Container, Box } from "@mui/material";
import AdminAnalyticsChart from "../components/AdminAnalyticsChart.jsx";
import Sidebar from "../components/Sidebar.jsx";

const AnalyticsAdminPage = () => (
  <>
    <Sidebar />
    <Container sx={{ mt: 4 }}>
      <AdminAnalyticsChart period="day" />
    </Container>
  </>
);

export default AnalyticsAdminPage;
