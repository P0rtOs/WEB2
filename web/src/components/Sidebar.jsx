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
  Box,
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
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import Login from "../components/Login";
import { Link } from "react-router";
import NotificationsPanel from "../components/NotificationsPanel";
import { useSelector, useDispatch } from "react-redux";
import { clearCurrentUser } from "../features/authSlice";

const drawerWidth = 240;

const Sidebar = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearCurrentUser());
    window.location.href = "/";
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
            // {
            //   text: "Notifications",
            //   icon: <NotificationsIcon />,
            //   to: "/notifications",
            // },
            {
              text: "My Events",
              icon: <EventIcon />,
              to: "/events/my-registrations",
            },
            { text: "Calendar", icon: <CalendarTodayIcon />, to: "/calendar" },
            {
              text: "Admin Analytics",
              icon: <BarChartIcon />,
              to: "/analytics/admin",
            },
            {
              text: "Admin Reports",
              icon: <BarChartIcon />,
              to: "/admin/reports",
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
        <List sx={{ mt: "auto", mb: 65 }}>
          <ListItem>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <NotificationsPanel />
            </Box>
          </ListItem>
          {currentUser ? (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                backgroundColor: "#C5CAE9",
                "&:hover": { backgroundColor: "#9FA8DA" },
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#0D1821" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: "bold",
                  color: "#0D1821",
                }}
              />
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={handleOpenLogin}
              sx={{
                backgroundColor: "#C5CAE9",
                "&:hover": { backgroundColor: "#9FA8DA" },
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#0D1821" }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText
                primary="Login"
                primaryTypographyProps={{
                  fontWeight: "bold",
                  color: "#0D1821",
                }}
              />
            </ListItem>
          )}
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
