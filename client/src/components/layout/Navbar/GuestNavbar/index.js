import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const GuestNavbar = ({ clearVessels }) => {
   return (
      <>
         <li className="navbar-list-item">
            <Link
               to="/vessels"
               className="navbar-list-link"
               onClick={() => {
                  window.scroll(0, 0);
                  clearVessels();
               }}
            >
               Book Now!
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
      </>
   );
};

GuestNavbar.propTypes = {
   clearVessels: PropTypes.func.isRequired,
};

export default GuestNavbar;
