import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/HomePage";
import Events from "./pages/EventsPage";
import Profile from "./pages/ProfilePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
