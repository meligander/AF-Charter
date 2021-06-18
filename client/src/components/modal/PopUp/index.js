import React from "react";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../../img/yatch.png";
import "./style.scss";

const PopUp = ({
   toggleModal,
   setToggleModal,
   confirm,
   text,
   subtext,
   finished,
   uploadRef,
   progressRef,
   type,
}) => {
   const selectType = () => {
      switch (type) {
         case "confirmation":
            return (
               <div className="popup-text">
                  <p>{text}</p>
                  {subtext ? <p>{subtext}</p> : ""}
               </div>
            );
         case "uploadFile":
            return (
               <div className="popup-upload">
                  <span className="popup-upload-text" ref={uploadRef}></span>
                  <div className="up-popup-upload-progress">
                     <div
                        className="popup-upload-progress-bar"
                        ref={progressRef}
                     ></div>
                  </div>
               </div>
            );

         default:
            break;
      }
   };
   return (
      <div className={`blurr-bg popup ${!toggleModal ? "hide" : ""}`}>
         <div className="popup-content text-center">
            <div className="popup-heading">
               <img className="popup-heading-img" src={logo} alt="logo" />
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     if (finished !== undefined && finished) {
                        setToggleModal();
                        confirm();
                     }

                     if (finished === undefined) setToggleModal();
                  }}
                  className={`btn popup-heading-btn ${
                     finished !== undefined && !finished ? "hide" : ""
                  }`}
               >
                  <AiOutlineClose className="icon" />
               </button>
            </div>
            {selectType()}
            {type !== "uploadFile" && (
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
            )}
         </div>
      </div>
   );
};

PopUp.propTypes = {
   text: PropTypes.string,
   subtext: PropTypes.string,
   toggleModal: PropTypes.bool.isRequired,
   setToggleModal: PropTypes.func.isRequired,
   confirm: PropTypes.func,
   finished: PropTypes.bool,
   uploadRef: PropTypes.object,
   progressRef: PropTypes.object,
   type: PropTypes.string.isRequired,
};

export default PopUp;
