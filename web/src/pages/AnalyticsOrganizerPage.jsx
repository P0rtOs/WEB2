// src/pages/AnalyticsOrganizerPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  TextField,
  Link,
} from "@mui/material";
import { apiEvents } from "../Auth_api";

export default function AnalyticsOrganizerPage({ eventId }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reports, setReports] = useState([]);

  // 1) Загружаем общую аналитику
  useEffect(() => {
    apiEvents
      .get(`../analytics/organizer/`)
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));

    fetchReports();
  }, [eventId]);

  const fetchReports = () => {
    apiEvents
      .get(`../${eventId}/reports/`)
      .then((res) => setReports(res.data))
      .catch(console.error);
  };

  const handleGenerate = () => {
    setLoading(true);
    apiEvents
      .post(`../${eventId}/generate-report/`, null, {
        params: { date_from: from, date_to: to },
      })
      .then(() => fetchReports())
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  if (loading) return <CircularProgress />;
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Organizer Analytics
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography>Total Events: {summary.total_events}</Typography>
        <Typography>
          Total Tickets Sold: {summary.total_tickets_sold}
        </Typography>
        <Typography>Total Revenue: {summary.revenue} грн</Typography>
      </Box>

      {/* Генерация отчёта */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <TextField
          label="From (YYYY-MM-DD)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          size="small"
        />
        <TextField
          label="To (YYYY-MM-DD)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleGenerate}>
          Generate Report
        </Button>
      </Box>

      {/* Список отчётов */}
      {reports.length === 0 ? (
        <Typography>No reports yet.</Typography>
      ) : (
        reports.map((r) => (
          <Box key={r.id} sx={{ mb: 1 }}>
            <Link href={r.file} target="_blank" rel="noopener">
              {new Date(r.created_at).toLocaleString()} — Download
            </Link>
          </Box>
        ))
      )}
    </Container>
  );
}
