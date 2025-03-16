// C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/web/src/components/Header.jsx
import React from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import "../css/Header.scss";

const Header = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontSize: "1.8rem" }}>
          Event Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ fontSize: "1.2rem" }}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/events"
                style={{ fontSize: "1.2rem" }}
              >
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                style={{ fontSize: "1.2rem" }}
              >
                About
              </Link>
            </li>
            {currentUser && currentUser.is_staff && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/analytics/admin"
                  style={{ fontSize: "1.2rem" }}
                >
                  Admin Analytics
                </Link>
              </li>
            )}
            {currentUser &&
              currentUser.user_type === "organizer" &&
              !currentUser.is_staff && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/analytics/organizer"
                    style={{ fontSize: "1.2rem" }}
                  >
                    Organizer Analytics
                  </Link>
                </li>
              )}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/login"
                style={{ fontSize: "1.2rem" }}
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/test"
                style={{ fontSize: "1.2rem" }}
              >
                Test
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
