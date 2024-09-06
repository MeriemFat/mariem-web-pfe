import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import LogoutPage from './Logout';
import { Dropdown } from "react-bootstrap";
import { useAuthContext } from "../../../services/useAuthContext";
import axios from "axios";

import avatar from "../../../images/avatar/1.jpg";

const Header = ({ onNote, toggle, onProfile, onActivity, onNotification }) => {
   const { USER } = useAuthContext();
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {}, [USER]);

   const goToLogin = () => {
      navigate('/login');
   }

   const goToSignUp = () => {
      navigate('/register');
   }

 
   const getPageName = (path) => {
      const pathParts = path.split('/').filter(Boolean);
      if (pathParts.length === 0) {
          return 'Dashboard';
      }

      const filterParts = pathParts.filter(part => !['app', 'ui', 'uc', 'basic', 'form', 'table', 'page', 'email', 'ecom', 'chart', 'editor'].includes(part));
      const capitalizedParts = filterParts.map(part => part.charAt(0).toUpperCase() + part.slice(1));

      return capitalizedParts.join(' ');
   };

   const page_name = getPageName(location.pathname);

   return (
       USER ?
       <div className="header">
          <div className="header-content">
             <nav className="navbar navbar-expand">
                <div className="collapse navbar-collapse justify-content-between">
                   <div className="header-left">
                      <div className="dashboard_bar" style={{ textTransform: "capitalize" }}>
                         {page_name}
                      </div>
                   </div>
                   <ul className="navbar-nav header-right">
                      <Dropdown as="li" className="nav-item dropdown notification_dropdown">
                         <Dropdown.Toggle as="a" className="nav-link ai-icon i-false">
                            {/* SVG et autres contenus */}
                         </Dropdown.Toggle>
                         <Dropdown.Menu align="end" className={`dropdown-menu ${toggle === "activity" ? "show" : ""}`}>
                            <PerfectScrollbar id="DZ_W_Notification1" className={`widget-media dz-scroll p-3 height380 ${toggle === "activity" ? "ps ps--active-y" : ""}`}>
                               {/* Contenus des notifications */}
                            </PerfectScrollbar>
                            <Link className="all-notification" to="#">
                               See all notifications <i className="ti-arrow-right"></i>
                            </Link>
                         </Dropdown.Menu>
                      </Dropdown>
                      <li className="nav-item dropdown notification_dropdown">
                         <Link to="/chat" className="nav-link bell bell-link" onClick={() => onNote()}>
                            {/* SVG et autres contenus */}
                            <span className="badge light text-white bg-primary">*</span>
                         </Link>
                      </li>
                      <Dropdown as="li" className="nav-item header-profile" onClick={() => onProfile()}>
                         <Dropdown.Toggle as="a" className="nav-link i-false">
                            <div className="header-info">
                               <small>Good Morning</small>
                               <span>{USER.fullname}</span>
                            </div>
                            <img src={USER.avatar ? USER.avatar : avatar} width="20" alt=""/>
                         </Dropdown.Toggle>
                         <Dropdown.Menu align="end" className={`dropdown-menu ${toggle === "profile" ? "show" : ""}`}>
                            <Link to="/app-profile" className="dropdown-item ai-icon">
                               <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                               </svg>
                               <span className="ms-2">Profile</span>
                            </Link>
                            <LogoutPage/>
                         </Dropdown.Menu>
                      </Dropdown>
                   </ul>
                </div>
             </nav>
          </div>
       </div>
       :
       <div>
          <span>
             <button className='btn btn-primary btn--sm' onClick={goToLogin} style={{marginLeft:"80%"}}>Login</button>
             <button className='btn btn--outlined btn--sm' onClick={goToSignUp}>Sign up</button>
          </span>
       </div>
   );
};

export default Header;
