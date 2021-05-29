import React from "react";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../../img/yatch.png";
import "./style.scss";

const PopUp = ({ toggleModal, setToggleModal, confirm, text, subtext }) => {
   return (
      <div className={`blurr-bg popup ${!toggleModal ? "hide" : ""}`}>
         <div className="popup-content text-center">
            <div className="popup-heading">
               <img className="popup-heading-img" src={logo} alt="logo" />
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     setToggleModal();
                  }}
                  className="btn popup-heading-btn"
               >
                  <AiOutlineClose className="icon" />
               </button>
            </div>
            <div className="popup-text">
               <p>{text}</p>
               {subtext ? <p>{subtext}</p> : ""}
            </div>
            <div className="btn-center">
               <button
                  type="button"
                  className="btn btn-success"
                  onClick={(e) => {
                     e.preventDefault();
                     confirm();
                     setToggleModal();
                  }}
               >
                  OK
               </button>
               <button
                  type="button"
                  className="btn btn-danger"
                  onClick={(e) => {
                     e.preventDefault();
                     setToggleModal();
                  }}
               >
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
};

PopUp.propTypes = {
   text: PropTypes.string.isRequired,
   subtext: PropTypes.string,
   toggleModal: PropTypes.bool.isRequired,
   setToggleModal: PropTypes.func.isRequired,
   confirm: PropTypes.func.isRequired,
};

export default PopUp;
