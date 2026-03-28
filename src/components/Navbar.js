import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "/src/styles/Navbar.css";

import { ReactComponent as LogoSVG } from "/src/images/Disney+_logo.svg";

var avatarURL = "https://i.pravatar.cc/" + Math.round(Math.random() * 500);

const navLinks = [
  { icon: "home", label: "Home" },
  { icon: "search", label: "Search" },
  { icon: "plus", label: "Watchlist" },
  { icon: "clapper", label: "Movies" },
  { icon: "grid", label: "Series" },
  { icon: "star", label: "Originals" },
];

const icons = {
  home: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3l9 8h-3v7a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-7H3l9-8z"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.48-5.34C15.25 5.59 12.42 3 8.88 3S2.5 5.59 2.5 8.39c0 2.8 2.83 5.39 6.38 5.39 1.61 0 3.09-.58 4.23-1.54l.27.28v.79l4.99 4.9 1.49-1.48-4.86-4.73Zm-6.62 0c-2.89 0-5.25-2.2-5.25-4.9 0-2.7 2.36-4.9 5.25-4.9 2.9 0 5.25 2.2 5.25 4.9 0 2.7-2.35 4.9-5.25 4.9Z"
      />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
    </svg>
  ),
  clapper: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h2.5l2 4H6l-2-4Zm4.5 0H11l2 4H10.5l-2-4Zm4.5 0h2.5l2 4h-2.5l-2-4ZM3 10h18v10H3V10Z"
      />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z"
      />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 17.3 5.82 21l1.18-6.81L2 9.8l6.91-1L12 2l3.09 6.79 6.91 1-5 4.39L18.18 21 12 17.3Z"
      />
    </svg>
  ),
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (path === "home") {
      navigate("/");
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <header className="dplus-nav">
      <div className="dplus-nav-left">
        <a href="/" className="dplus-nav-logo-link" onClick={handleLogoClick}>
          <LogoSVG className="logo" />
        </a>
        <nav className="dplus-nav-links">
          {navLinks.map((item) => (
            <a
              href={`#${item.label.toLowerCase()}`}
              className={`dplus-nav-link ${location.pathname === "/" && item.label.toLowerCase() === "home" ? "active" : ""}`}
              key={item.label}
              onClick={(e) => handleNavClick(e, item.label.toLowerCase())}
            >
              {icons[item.icon]}
              <span className="dplus-nav-link-label">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="dplus-nav-profile">
        <span className="dplus-nav-username">Kristine</span>
        <button className="dplus-avatar-btn">
          <img
            className="dplus-avatar-img"
            src={avatarURL}
            alt="profile-avatar"
          />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
