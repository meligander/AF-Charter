import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
//import PropTypes from "prop-types";

import yatch from "../../../img/yatch.png";
import "./style.scss";

const Navbar = ({ location }) => {
   const [adminValues, setAdminValues] = useState({
      showNav: location.pathname === "/" ? false : true,
   });

   const { showNav } = adminValues;

   window.onscroll = function () {
      if (location.pathname === "/") {
         if (window.pageYOffset > 550)
            setAdminValues((prev) => ({ ...prev, showNav: true }));
         else setAdminValues((prev) => ({ ...prev, showNav: false }));
      }
   };
   return (
      <nav className={`navbar ${showNav ? "show" : ""}`}>
         <Link className="navbar-logo" to="/">
            <img src={yatch} alt="AF Charter Logo" />
         </Link>
         <ul className="navbar-list">
            <li className="navbar-list-item">
               <Link to="/vessels" className="navbar-list-link">
                  Bookings
               </Link>
            </li>
            <li className="navbar-list-item">
               <Link to="/contact" className="navbar-list-link">
                  Contact Us
               </Link>
            </li>
            <li className="navbar-list-item">
               <Link to="/login" className="navbar-list-link">
                  Login
               </Link>
            </li>
         </ul>
      </nav>
   );
};

Navbar.propTypes = {};

export default withRouter(Navbar);
