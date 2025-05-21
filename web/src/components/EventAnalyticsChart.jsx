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
import { apiEvents } from "../Auth_api";

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

  if (!data.length) return <p>Немає даних.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <h2 className="text-xl font-semibold mb-3">Аналітика події</h2>
      <p>
        Продано білетів: <strong>{summary.total_tickets}</strong>
      </p>
      <p>
        Виручка: <strong>{summary.total_revenue} грн</strong>
      </p>
      {summary.used_tickets !== undefined && (
        <p>
          Використано білетів: <strong>{summary.used_tickets}</strong>
        </p>
      )}
      <LineChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tickets" name="Продано білетів" />
        <Line type="monotone" dataKey="revenue" name="Виручка, грн" />
      </LineChart>
    </ResponsiveContainer>
  );
}
