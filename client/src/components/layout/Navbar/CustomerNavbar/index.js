import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import "../style.scss";

const CustomerNavbar = ({ clearReservations }) => {
   return (
      <>
         <li className="navbar-list-item hide-sm">
            <Link
               to="/vessels"
               className="navbar-list-link"
               onClick={() => {
                  window.scroll(0, 0);
                  clearReservations();
               }}
            >
               Book Now!
            </Link>
         </li>
         <li className="navbar-list-item hide-sm">
            <Link
               to="/myreservations"
               className="navbar-list-link"
               onClick={() => {
                  window.scroll(0, 0);
                  clearReservations();
               }}
            >
               My Reservations
            </Link>
         </li>
         <li className="navbar-list-item hide-sm">
            <Link
               to="/contact"
               className="navbar-list-link"
               onClick={() => window.scroll(0, 0)}
            >
               Contact Us
            </Link>
         </li>
      </>
   );
};

CustomerNavbar.propTypes = {
   clearReservations: PropTypes.func.isRequired,
};

export default CustomerNavbar;
