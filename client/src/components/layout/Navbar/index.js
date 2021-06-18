import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

import { logOut } from "../../../actions/auth";
import { clearReservations } from "../../../actions/reservation";
import { clearVessels } from "../../../actions/vessel";

import GuestNavbar from "./GuestNavbar";
import CustomerNavbar from "./CustomerNavbar";
import NavPage from "../../shared/NavPage";
import Loading from "../../modal/Loading";

import yatch from "../../../img/yatch.png";
import "./style.scss";

const Navbar = ({
   location,
   auth: { isAuthenticated, loggedUser, loading, error },
   mixvalues: { loadingSpinner },
   logOut,
   clearReservations,
   clearVessels,
}) => {
   const screenWidth = window.innerWidth;

   const [adminValues, setAdminValues] = useState({
      showNav: false,
      showMenu: false,
      isAdmin: false,
   });

   const { showNav, showMenu, isAdmin } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         showNav: location.pathname !== "/",
         ...(isAuthenticated &&
            (loggedUser.type === "admin" ||
               loggedUser.type === "admin&captain") && { isAdmin: true }),
      }));
   }, [location.pathname, loggedUser, isAuthenticated]);

   window.onscroll = function () {
      if (location.pathname === "/") {
         if (window.pageYOffset > 550)
            setAdminValues((prev) => ({ ...prev, showNav: true }));
         else setAdminValues((prev) => ({ ...prev, showNav: false }));
      }
   };

   const setShowMenu = (newValue) => {
      setAdminValues((prev) => ({ ...prev, showMenu: newValue }));
   };

   const types = () => {
      if (isAuthenticated) {
         switch (loggedUser.type) {
            case "customer":
               return <CustomerNavbar clearReservations={clearReservations} />;
            default:
               return "";
         }
      } else return <GuestNavbar clearVessels={clearVessels} />;
   };

   return (
      <>
         {(loadingSpinner ||
            (!isAuthenticated && !loading && typeof error === "string")) && (
            <Loading />
         )}
         {(isAdmin || screenWidth < 550) && isAuthenticated && (
            <NavPage
               showMenu={showMenu}
               loggedUser={loggedUser}
               setShowMenu={setShowMenu}
            />
         )}
         <nav className={`navbar ${showNav ? "show" : ""}`}>
            <Link
               className="navbar-logo"
               to={isAdmin ? "/dashboard" : "/"}
               onClick={() => {
                  window.scroll(0, 0);
               }}
            >
               <img src={yatch} alt="AF Charter Logo" />
            </Link>
            <ul className="navbar-list">
               {types()}
               {isAuthenticated && (
                  <li className="navbar-list-item">
                     <Link
                        to={screenWidth >= 550 && !isAdmin ? "/profile" : "#"}
                        className="navbar-list-link"
                        onClick={() => {
                           if (screenWidth > 550 && !isAdmin)
                              window.scroll(0, 0);
                           else setShowMenu(true);
                        }}
                     >
                        {loggedUser.img && loggedUser.img.filePath !== "" ? (
                           <div
                              className="navbar-list-img img"
                              style={{
                                 backgroundImage: `url( ${loggedUser.img.filePath})`,
                              }}
                           ></div>
                        ) : (
                           <div className="navbar-list-img not">
                              <FaUser className="icon" />
                           </div>
                        )}
                     </Link>
                  </li>
               )}

               <li className="navbar-list-item">
                  <Link
                     to={!isAuthenticated ? "/login" : "#"}
                     className="navbar-list-link"
                     onClick={() => {
                        if (isAuthenticated) logOut();
                        window.scroll(0, 0);
                     }}
                  >
                     {isAuthenticated ? (
                        <FiLogOut className="icon" />
                     ) : screenWidth > 550 ? (
                        "Login"
                     ) : (
                        <FiLogIn className="icon" />
                     )}
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
