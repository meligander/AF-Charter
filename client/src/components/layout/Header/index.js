import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FiLogOut } from "react-icons/fi";

import { logOut } from "../../../actions/auth";
import { clearReservations } from "../../../actions/reservation";

import yatch from "../../../img/yatch.png";
import "./style.scss";

const Header = ({
   auth: { isAuthenticated, loggedUser, loading },
   logOut,
   clearReservations,
}) => {
   return (
      <header className="header">
         <nav className="header-nav">
            <div className="header-nav-icon">
               <img src={yatch} alt="AF-logo" />
            </div>
            <ul className="navbar-list">
               {!loading && isAuthenticated && loggedUser.type === "customer" && (
                  <li className="navbar-list-item hide-sm">
                     <Link
                        onClick={() => {
                           window.scroll(0, 0);
                           clearReservations();
                        }}
                        to="/myreservations"
                        className="navbar-list-link"
                     >
                        My Reservations
                     </Link>
                  </li>
               )}
               <li
                  className={`navbar-list-item ${
                     isAuthenticated ? "hide-sm" : ""
                  }`}
               >
                  <Link
                     to="/contact"
                     onClick={() => window.scroll(0, 0)}
                     className="navbar-list-link"
                  >
                     Contact Us
                  </Link>
               </li>
               <li className="navbar-list-item">
                  <Link
                     to={!isAuthenticated ? "/login" : "#"}
                     onClick={() => {
                        if (isAuthenticated) logOut();
                        window.scroll(0, 0);
                     }}
                     className="navbar-list-link last"
                  >
                     {isAuthenticated ? <FiLogOut className="icon" /> : "Login"}
                  </Link>
               </li>
            </ul>
         </nav>
         <div className="header-main">
            <div>
               <h3 className="header-main-title">AF Charters</h3>
               <p className="header-main-desc">Rent a Boat in Miami!</p>
               <div className="btn-center">
                  <Link
                     to="/vessels"
                     onClick={() => window.scroll(0, 0)}
                     className="btn"
                  >
                     Book Now!
                  </Link>
               </div>
            </div>
         </div>
      </header>
   );
};

Header.propTypes = {
   auth: PropTypes.object.isRequired,
   logOut: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   logOut,
   clearReservations,
})(Header);
