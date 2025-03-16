import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { apiEvents } from "../Auth_api.js";

const AnalyticsAdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiEvents.get("/analytics/admin/");
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching admin analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Analytics
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>Total Events: {analytics.total_events}</Typography>
        <Typography>Total Users: {analytics.total_users}</Typography>
        <Typography>Total Revenue: {analytics.total_revenue} грн</Typography>
      </Box>
    </Container>
  );
};

export default AnalyticsAdminPage;
