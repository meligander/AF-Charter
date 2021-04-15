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
            <ul className="header-nav-list">
               <li className="header-nav-item">
                  <Link className="header-nav-link">Bookings</Link>
               </li>
               <li className="header-nav-item">
                  <Link className="header-nav-link last">Login</Link>
               </li>
            </ul>
         </nav>
         <div className="header-main">
            <h3 className="header-main-title">AF Charters</h3>
            <p className="header-main-desc" data-text="Rent a Boat in Miami!">
               Rent a Boat in Miami!
            </p>
            <div className="btn-center">
               <Link className="btn">Book Now!</Link>
            </div>
         </div>
      </header>
   );
};

export default Header;
