import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IoBoat } from "react-icons/io5";
import { ImBook } from "react-icons/im";
import { FaWrench, FaUser, FaDollarSign } from "react-icons/fa";

import { clearVessels } from "../../../../actions/vessel";
import { clearUsers } from "../../../../actions/user";
import { clearReservations } from "../../../../actions/reservation";

const AdminLinks = ({
   showMenu,
   currentNav,
   setShowMenu,
   clearVessels,
   clearReservations,
   clearUsers,
}) => {
   return (
      <>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "reservations" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/reservations"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
                  clearReservations();
                  clearUsers();
                  clearVessels();
               }}
            >
               <ImBook className="icon" />
               &nbsp; Reservations
            </Link>
         </li>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "vessels" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/vessels-list"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
                  clearVessels();
               }}
            >
               <IoBoat className="icon" />
               &nbsp; Vessels
            </Link>
         </li>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "manteinance" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/manteinance"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
               }}
            >
               <FaWrench className="icon" />
               &nbsp; Manteinance
            </Link>
         </li>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "payments" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/payments"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
               }}
            >
               <FaDollarSign className="icon" />
               &nbsp; Payments
            </Link>
         </li>
         <li
            className={`navbar-list-item ${
               showMenu
                  ? `show ${currentNav === "users" ? "current" : ""} `
                  : ""
            }`}
         >
            <Link
               className="navbar-list-link"
               to="/users"
               onClick={() => {
                  window.scroll(0, 0);
                  setShowMenu(false);
               }}
            >
               <FaUser className="icon" />
               &nbsp; Users
            </Link>
         </li>
      </>
   );
};

AdminLinks.propTypes = {
   currentNav: PropTypes.string.isRequired,
   showMenu: PropTypes.bool.isRequired,
   setShowMenu: PropTypes.func.isRequired,
   clearVessels: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
   clearUsers: PropTypes.func.isRequired,
};

export default connect(null, { clearVessels, clearReservations, clearUsers })(
   AdminLinks
);
