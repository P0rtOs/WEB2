// src/components/EventAnalyticsChart.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiEvents } from "../Auth_api.js";

export default function EventAnalyticsChart({ eventId, period = "day" }) {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiEvents
      .get(`/${eventId}/analytics/`, { params: { period } })
      .then((res) => {
        setSummary(res.data.summary);
        setData(
          res.data.series.map((item) => ({
            ...item,
            label:
              period === "hour"
                ? new Date(item.period).getHours() + ":00"
                : item.period.slice(0, 10),
          }))
        );
      })
      .catch(console.error);
  }, [eventId, period]);

  if (!data.length) return <p>Нет данных для отображения.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tickets" name="Продано билетов" />
        <Line type="monotone" dataKey="revenue" name="Выручка, грн" />
      </LineChart>
    </ResponsiveContainer>
  );
}
