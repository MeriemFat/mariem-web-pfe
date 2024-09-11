import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import LogoutPage from "./Logout";
import { Dropdown } from "react-bootstrap";
import { useAuthContext } from "../../../services/useAuthContext";
import axios from "axios";

import avatar from "../../../images/avatar/1.jpg";

const Header = ({ onNote, toggle, onProfile, onActivity, onNotification }) => {
  // const { USER } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [USER, setUser] = useState({});
  useEffect(() => {
    const user = localStorage.getItem("user");
    const value = JSON.parse(user);
    console.log(value)
    setUser(value);
  }, []);

  const getPageName = (path) => {
    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length === 0) {
      return "Dashboard";
    }

    const filterParts = pathParts.filter(
      (part) =>
        ![
          "app",
          "ui",
          "uc",
          "basic",
          "form",
          "table",
          "page",
          "email",
          "ecom",
          "chart",
          "editor",
        ].includes(part)
    );
    const capitalizedParts = filterParts.map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );

    return capitalizedParts.join(" ");
  };

  const page_name = getPageName(location.pathname);

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              >
                {page_name}
              </div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item dropdown notification_dropdown">
                <Link
                  to="/chat"
                  className="nav-link bell bell-link"
                  onClick={() => onNote()}
                >
                  {/* SVG et autres contenus */}
                  <span className="badge light text-white bg-primary">*</span>
                </Link>
              </li>
              <Dropdown
                as="li"
                className="nav-item header-profile"
                onClick={() => onProfile()}
              >
                <Dropdown.Toggle as="a" className="nav-link i-false">
                  <div className="header-info">
                    <small>Good Morning</small>
                    <span>{`${USER?.Nom} ${USER?.prenom}`}</span>
                  </div>
                  <img
                    src={USER?.avatar ? USER?.avatar : avatar}
                    width="20"
                    alt=""
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="end"
                  className={`dropdown-menu ${
                    toggle === "profile" ? "show" : ""
                  }`}
                >
                  <Link to="/profile" className="dropdown-item ai-icon">
                    <svg
                      id="icon-user1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="ms-2">Profile</span>
                  </Link>
                  <LogoutPage />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
