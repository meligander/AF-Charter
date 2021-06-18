import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ImBook } from "react-icons/im";
import { AiTwotonePhone } from "react-icons/ai";
import { IoBoat } from "react-icons/io5";

import { clearReservations } from "../../../../actions/reservation";

const CustomerLinks = ({
   currentNav,
   showMenu,
   setShowMenu,
   clearReservations,
}) => {
   return (
      <>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "index" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/vessels"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
                  clearReservations();
               }}
            >
               <IoBoat className="icon" />
               &nbsp; Book Now!
            </Link>
         </li>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "index" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/myreservations"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
                  clearReservations();
               }}
            >
               <ImBook className="icon" />
               &nbsp; My Reservations
            </Link>
         </li>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "index" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/contact"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
               }}
            >
               <AiTwotonePhone className="icon" />
               &nbsp; Contact Us
            </Link>
         </li>
      </>
   );
};

CustomerLinks.propTypes = {
   currentNav: PropTypes.string.isRequired,
   showMenu: PropTypes.bool.isRequired,
   setShowMenu: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
};

export default connect(null, { clearReservations })(CustomerLinks);
