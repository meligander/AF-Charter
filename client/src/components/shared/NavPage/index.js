import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import PropTypes from "prop-types";

import CustomerLinks from "./CustomerLinks";
import AdminLinks from "./AdminLinks";

import "./style.scss";

const NavPage = ({ showMenu, loggedUser, location, setShowMenu }) => {
   const [adminValues, setAdminValues] = useState({
      currentNav: "",
   });

   const { currentNav } = adminValues;

   useEffect(() => {
      let currentNav = "/dashboard";
      switch (location.pathname) {
         case "/manteinace":
            currentNav = "manteinace";
            break;
         case "/vessels":
            currentNav = "vessels";
            break;
         case "/profile":
            currentNav = "profile";
            break;
         default:
            break;
      }
      setAdminValues((prev) => ({ ...prev, currentNav }));
   }, [location]);

   const type = () => {
      switch (loggedUser.type) {
         case "customer":
            return (
               <CustomerLinks
                  currentNav={currentNav}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
               />
            );
         default:
            return (
               <AdminLinks
                  currentNav={currentNav}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
               />
            );
      }
   };

   return (
      <div className={`menu ${showMenu ? "show" : ""}`}>
         <button
            type="button"
            className="menu-close"
            onClick={() => setShowMenu(false)}
         >
            <AiOutlineClose />
         </button>
         <div className="menu-profile">
            <div
               className="menu-profile-img img"
               style={{
                  backgroundImage: `url( ${loggedUser.img.filePath})`,
               }}
            ></div>
            <h2 className="heading heading-secondary text-secondary">
               {loggedUser.name + " " + loggedUser.lastname}
            </h2>
            <ul className="menu-list p-0">
               <li
                  className={`navbar-list-item show ${
                     currentNav === "profile" ? "current" : ""
                  } p-0`}
               >
                  <Link
                     className="navbar-list-link"
                     to="/profile"
                     onClick={() => {
                        window.scroll(0, 0);
                        setShowMenu(false);
                     }}
                  >
                     <CgProfile className="icon" />
                     &nbsp; See Profile
                  </Link>
               </li>
            </ul>
         </div>
         <ul className={`menu-list ${showMenu ? "show" : ""}`}>{type()}</ul>
      </div>
   );
};

NavPage.propTypes = {
   showMenu: PropTypes.bool.isRequired,
   loggedUser: PropTypes.object.isRequired,
   setShowMenu: PropTypes.func.isRequired,
};

export default withRouter(NavPage);
