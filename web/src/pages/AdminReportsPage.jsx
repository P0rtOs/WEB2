import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import axios from "axios";
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { apiAuth } from "../Auth_api";

export default function AdminReportsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [stats, setStats] = useState({ summary: null, series: [] });

  useEffect(() => {
    apiAuth
      .get("/api/events/")
      .then((res) => setEvents(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    apiAuth
      .get(`/api/analytics/eventsales/${selectedEvent.id}/?period=day`)
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, [selectedEvent]);

  return (
    <Box display="flex" gap={2}>
      <Box width="25%">
        <List component="nav">
          {events.map((ev) => (
            <ListItemButton
              key={ev.id}
              selected={selectedEvent?.id === ev.id}
              onClick={() => setSelectedEvent(ev)}
            >
              <ListItemText primary={ev.title} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box flexGrow={1}>
        {selectedEvent ? (
          <>
            <Typography variant="h5" gutterBottom>
              Analytics for: {selectedEvent.title}
            </Typography>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography>
                  <strong>Total Tickets Sold:</strong>{" "}
                  {stats.summary?.total_tickets}
                </Typography>
                <Typography>
                  <strong>Total Revenue:</strong> {stats.summary?.total_revenue}{" "}
                  UAH
                </Typography>
                <Typography>
                  <strong>Used Tickets:</strong> {stats.summary?.used_tickets}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.series}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tickets"
                      name="Tickets Sold"
                    />
                    <Line type="monotone" dataKey="revenue" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          <Typography>Select an event to view its report.</Typography>
        )}
      </Box>
    </Box>
  );
}
