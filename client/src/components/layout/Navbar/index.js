import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logOut } from "../../../actions/auth";

import yatch from "../../../img/yatch.png";
import "./style.scss";

const Navbar = ({ location, auth: { isAuthenticated }, logOut }) => {
   const [adminValues, setAdminValues] = useState({
      showNav: false,
   });

   const { showNav } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         showNav: location.pathname !== "/",
      }));
   }, [location.pathname]);

   window.onscroll = function () {
      if (location.pathname === "/") {
         if (window.pageYOffset > 550)
            setAdminValues((prev) => ({ ...prev, showNav: true }));
         else setAdminValues((prev) => ({ ...prev, showNav: false }));
      }
   };
   return (
      <nav className={`navbar ${showNav ? "show" : ""}`}>
         <Link
            className="navbar-logo"
            to="/"
            onClick={() => {
               window.scroll(0, 0);
            }}
         >
            <img src={yatch} alt="AF Charter Logo" />
         </Link>
         <ul className="navbar-list">
            <li className="navbar-list-item">
               <Link
                  to="/vessels"
                  className="navbar-list-link"
                  onClick={() => {
                     window.scroll(0, 0);
                  }}
               >
                  Bookings
               </Link>
            </li>
            <li className="navbar-list-item">
               <Link
                  to="/contact"
                  className="navbar-list-link"
                  onClick={() => window.scroll(0, 0)}
               >
                  Contact Us
               </Link>
            </li>
            <li className="navbar-list-item">
               <Link
                  to={isAuthenticated ? "/" : "/login"}
                  className="navbar-list-link"
                  onClick={() => {
                     if (isAuthenticated) {
                        logOut();
                     }
                     window.scroll(0, 0);
                  }}
               >
                  {isAuthenticated ? "Logout" : "Login"}
               </Link>
            </li>
         </ul>
      </nav>
   );
};

Navbar.propTypes = {
   auth: PropTypes.object.isRequired,
   logOut: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { logOut })(withRouter(Navbar));
