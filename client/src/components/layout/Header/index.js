import React from "react";
import { Link } from "react-router-dom";

import yatch from "../../../img/yatch.png";
import "./style.scss";

const Header = () => {
   return (
      <header className="header">
         <nav className="header-nav">
            <div className="header-nav-icon">
               <img src={yatch} alt="AF-logo" />
            </div>
            <ul className="navbar-list">
               <li className="navbar-list-item">
                  <Link to="/contact" className="navbar-list-link">
                     Contact Us
                  </Link>
               </li>
               <li className="navbar-list-item">
                  <Link to="/login" className="navbar-list-link last">
                     Login
                  </Link>
               </li>
            </ul>
         </nav>
         <div className="header-main">
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
      </header>
   );
};

export default Header;
