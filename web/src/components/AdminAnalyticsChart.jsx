// src/components/AdminAnalyticsChart.jsx
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

export default function AdminAnalyticsChart({ period = "day" }) {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiEvents
      .get("/analytics/admin/", { params: { period } })
      .then((res) => {
        const { summary, series } = res.data;
        setSummary(summary);
        setData(
          series.map((item) => ({
            ...item,
            // Метка на X: либо час, либо дата
            label:
              period === "hour"
                ? new Date(item.period).getHours() + ":00"
                : item.period.slice(0, 10),
          }))
        );
      })
      .catch(console.error);
  }, [period]);

  if (!data.length) return <p>Немає даних для відображення.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <div>
        <h2 className="text-xl font-semibold mb-3">Графік продажів (Admin)</h2>
        <p>
          Усього івентів: <strong>{summary.total_events}</strong>
        </p>
        <p>
          Усього користувачів <strong>{summary.total_users}</strong>
        </p>
        <p>
          Продано білетів: <strong>{summary.total_tickets}</strong>
        </p>
        <p>
          Виручка: <strong>{summary.total_revenue} грн</strong>
        </p>
        <p>
          Використано білетів: <strong>{summary.used_tickets}</strong>
        </p>
      </div>
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
