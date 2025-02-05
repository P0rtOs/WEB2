import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/HomePage.jsx";
import Events from "./pages/EventsPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Registration from "./pages/RegistrationPage.jsx";
import Login from "./pages/LoginPage.jsx";
import "./css/Main.scss";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
