import React from "react";
import { Link } from "react-router";
import "../css/Header.scss";

const Header = () => {
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
              <Link className="nav-link" to="/events" style={{ fontSize: "1.2rem" }}>
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" style={{ fontSize: "1.2rem" }}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login" style={{ fontSize: "1.2rem" }}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
