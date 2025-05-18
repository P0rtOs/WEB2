import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/HomePage.jsx";
import Events from "./pages/EventsPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Registration from "./pages/RegistrationPage.jsx";
import Login from "./pages/LoginPage.jsx";
import Test from "./pages/TestPage.jsx";
import AddEventPage from "./pages/AddEventPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import TicketPurchasePage from "./pages/TicketPurchasePage.jsx";
import AnalyticsOrganizerPage from "./pages/AnalyticsOrganizerPage.jsx";
import AnalyticsAdminPage from "./pages/AnalyticsAdminPage.jsx";
import MyRegistrationsPage from "./pages/MyRegistrationsPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";  // <-- Імпорт сторінки календаря
import "./css/Main.scss";

import { useDispatch } from "react-redux";
import { setCurrentUser, clearCurrentUser } from "./features/authSlice";
import { getUserProfile } from "./Auth_api.js";

function LoadCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    getUserProfile()
      .then((res) => dispatch(setCurrentUser(res.data)))
      .catch(() => dispatch(clearCurrentUser()));
  }, [dispatch]);
  return null;
}

function App() {
  return (
    <Router>
      <LoadCurrentUser />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/add-event" element={<AddEventPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/purchase-ticket/:id" element={<TicketPurchasePage />} />
        <Route path="/events/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="/analytics/organizer" element={<AnalyticsOrganizerPage />} />
        <Route path="/analytics/admin" element={<AnalyticsAdminPage />} />
        <Route path="/calendar" element={<CalendarPage />} />  {/* <-- Доданий маршрут */}
      </Routes>
    </Router>
  );
}

export default App;
