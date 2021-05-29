import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import "../style.scss";

const CustomerNavbar = ({ clearReservations }) => {
   return (
      <>
         <li className="navbar-list-item">
            <Link
               to="/myreservations"
               className="navbar-list-link"
               onClick={() => {
                  window.scroll(0, 0);
                  clearReservations();
               }}
            >
               <span className="hide-sm">My </span>Reservations
            </Link>
         </li>
         <li className="navbar-list-item">
            <Link
               to="/contact"
               className="navbar-list-link"
               onClick={() => window.scroll(0, 0)}
            >
               Contact<span className="hide-sm"> Us</span>
            </Link>
         </li>
      </>
   );
};

CustomerNavbar.propTypes = {
   clearReservations: PropTypes.func.isRequired,
};

export default CustomerNavbar;
