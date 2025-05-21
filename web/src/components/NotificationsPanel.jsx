// src/components/NotificationsPanel.jsx
import React, { useEffect, useState } from "react";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { apiAuth } from "../Auth_api";

export default function NotificationsPanel() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifs, setNotifs] = useState([]);

  // 1) WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(
      `${protocol}://${window.location.host}/ws/notifications/`
    );
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setNotifs((prev) => [data, ...prev]);
    };
    // 2) подгружаем историю Ajax’ом
    apiAuth.get("/notifications/").then((res) => setNotifs(res.data));
    return () => ws.close();
  }, []);

  const handleClick = async (n) => {
    if (!n.read) {
      try {
        await apiAuth.post(`/notifications/${n.id}/mark-read/`, {
          read: true,
        });
        setNotifs((ns) =>
          ns.map((x) => (x.id === n.id ? { ...x, read: true } : x))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {notifs.map((n, i) => (
          <MenuItem key={i} onClick={() => handleClick(n)}>
            {n.message} <br />
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </MenuItem>
        ))}
        {notifs.length === 0 && <MenuItem>Немає повідомлень</MenuItem>}
      </Menu>
    </>
  );
}
