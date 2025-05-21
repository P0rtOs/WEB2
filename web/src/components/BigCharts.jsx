import React, { PureComponent } from "react";
import { apiEvents } from "../Auth_api";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { id: 1, date: "2025-05-01", tickets_sold: 12, revenue: 1200.0 },
  { id: 2, date: "2025-05-02", tickets_sold: 8, revenue: 800.0 },
  { id: 3, date: "2025-05-03", tickets_sold: 15, revenue: 1500.0 },
  { id: 4, date: "2025-05-04", tickets_sold: 5, revenue: 500.0 },
  { id: 5, date: "2025-05-05", tickets_sold: 20, revenue: 2000.0 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const event = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p>
          <strong>Дата:</strong> {event.date}
        </p>
        <p>
          <strong>Виручка:</strong> ${event.revenue}
        </p>
        <p>
          <strong>Квитків продано:</strong> {event.tickets_sold}
        </p>
        <p>
          <strong>ID події:</strong> {event.id}
        </p>
      </div>
    );
  }

  return null;
};

export default class RevenueChart extends PureComponent {
  // Обробник кліку
  handleClick = (dataPoint) => {
    console.log("Клік по події з ID:", dataPoint.id);
    //navigate(`/events/${event.id}`)
  };

  renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    const radius = Math.min(Math.max(4, payload.tickets_sold), 12);
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#ff7300"
        stroke="#fff"
        strokeWidth={1}
        onClick={() => this.handleClick(payload)}
        style={{ cursor: "pointer" }}
      />
    );
  };

  render() {
    return (
      <ResponsiveContainer width="90%" height="90%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            fill="#8884d8"
            dot={this.renderCustomDot}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
