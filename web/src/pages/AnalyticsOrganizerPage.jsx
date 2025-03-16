import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { apiEvents } from "../Auth_api.js";

const AnalyticsOrganizerPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiEvents.get("/analytics/organizer/");
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching organizer analytics:", err);
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
        Organizer Analytics
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>Total Events: {analytics.total_events}</Typography>
        <Typography>
          Total Tickets Sold: {analytics.total_tickets_sold}
        </Typography>
        <Typography>Total Revenue: {analytics.revenue} грн</Typography>
      </Box>
    </Container>
  );
};

export default AnalyticsOrganizerPage;
