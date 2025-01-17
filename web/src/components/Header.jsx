import React from "react";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__logo">
          <a href="/">Event Manager</a>
        </div>
        <nav className="header__nav">
          <ul className="header__menu">
            <li>
              <a href="/events">Події</a>
            </li>
            <li>
              <a href="/about">Про нас</a>
            </li>
            <li>
              <a href="/contact">Контакти</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
