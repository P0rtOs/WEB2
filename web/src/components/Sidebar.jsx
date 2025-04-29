// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import ExtensionIcon from "@mui/icons-material/Extension";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import Login from "../components/Login";
import { Link } from "react-router";

const drawerWidth = 240;

const Sidebar = () => {
  const [openLogin, setOpenLogin] = useState(false);

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#E1E7F5",
            color: "#0D1821",
            display: "flex",
            flexDirection: "column",
            ml: `10rem`,
            borderRight: 1,
            borderColor: "#ADADAD",
          },
        }}
      >
        <Toolbar />
        <Divider />

        <List>
          {[
            { text: "Home", icon: <HomeIcon />, to: "/" },
            { text: "Search", icon: <SearchIcon />, to: "/search" },
            {
              text: "Notifications",
              icon: <NotificationsIcon />,
              to: "/notifications",
            },
            { text: "My Events", icon: <EventIcon />, to: "/events" },
            { text: "Calendar", icon: <CalendarTodayIcon />, to: "/calendar" },
            {
              text: "Admin Analytics",
              icon: <BarChartIcon />,
              to: "/analytics/admin",
            },
            {
              text: "Organizer Analytics",
              icon: <TimelineIcon />,
              to: "/analytics/organizer",
            },
            { text: "Test", icon: <ExtensionIcon />, to: "/test" },
          ].map(({ text, icon, to }) => (
            <ListItem button key={text} component={Link} to={to}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        <Divider />
        <List sx={{ mt: "auto" }}>
          <ListItem button onClick={handleOpenLogin}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      </Drawer>

      {/* Login Modal */}
      <Dialog
        open={openLogin}
        onClose={handleCloseLogin}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Login
          <IconButton
            aria-label="close"
            onClick={handleCloseLogin}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Login onClose={handleCloseLogin} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
