import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FiLogOut } from "react-icons/fi";

import { logOut } from "../../../actions/auth";
import { clearReservations } from "../../../actions/reservation";
import { clearVessels } from "../../../actions/vessel";

import GuestNavbar from "./GuestNavbar";
import CustomerNavbar from "./CustomerNavbar";
import Loading from "../../modal/Loading";

import yatch from "../../../img/yatch.png";
import "./style.scss";

const Navbar = ({
   location,
   auth: { isAuthenticated, userLogged, loading },
   mixvalues: { loadingSpinner },
   logOut,
   clearReservations,
   clearVessels,
}) => {
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

   const types = () => {
      if (isAuthenticated) {
         switch (userLogged.type) {
            case "customer":
               return <CustomerNavbar clearReservations={clearReservations} />;
            default:
               return "";
         }
      } else return <GuestNavbar clearVessels={clearVessels} />;
   };

   return (
      <>
         {(loadingSpinner || (!isAuthenticated && loading)) && <Loading />}
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
               {types()}
               <li className="navbar-list-item">
                  <Link
                     to={!isAuthenticated ? "/login" : "#"}
                     className="navbar-list-link"
                     onClick={() => {
                        if (isAuthenticated) logOut();
                        window.scroll(0, 0);
                     }}
                  >
                     {isAuthenticated ? <FiLogOut className="icon" /> : "Login"}
                  </Link>
               </li>
            </ul>
         </nav>
      </>
   );
};

Navbar.propTypes = {
   auth: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   logOut: PropTypes.func.isRequired,
   clearVessels: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   logOut,
   clearReservations,
   clearVessels,
})(withRouter(Navbar));
