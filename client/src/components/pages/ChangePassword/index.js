import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BiSave } from "react-icons/bi";

import { resetPassword, removeAuthError } from "../../../actions/auth";

import Alert from "../../shared/Alert";

import "./style.scss";

const ChangePassword = ({
   resetPassword,
   removeAuthError,
   auth: { error },
   match,
}) => {
   const [formData, setFormData] = useState({
      password: "",
      passwordConf: "",
   });

   const { password, passwordConf } = formData;

   const onSubmit = (e) => {
      e.preventDefault();
      resetPassword({ ...formData, resetLink: match.params.token });
   };

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.id]: e.target.value,
      }));
      if (error.constructor === Array && error.length > 0)
         removeAuthError(e.target.id);
   };

   return (
      <>
         <h2 className="heading heading-primary">Reset Password</h2>
         <div className="changepassword">
            <form onSubmit={onSubmit} className="form">
               <Alert type="2" />
               <div className="form-group">
                  <input
                     className={`form-input ${
                        error.constructor === Array &&
                        error.some((value) => value.param === "password")
                           ? "invalid"
                           : ""
                     }`}
                     id="password"
                     type="password"
                     value={password}
                     placeholder="Password"
                     onChange={onChange}
                  />
                  <label htmlFor="password" className="form-label">
                     Password
                  </label>
               </div>
               <div className="form-group">
                  <input
                     className={`form-input ${
                        error.constructor === Array &&
                        error.some((value) => value.param === "passwordConf")
                           ? "invalid"
                           : ""
                     }`}
                     id="passwordConf"
                     type="password"
                     value={passwordConf}
                     placeholder="Confirm Password"
                     onChange={onChange}
                  />
                  <label htmlFor="passwordConf" className="form-label">
                     Confirm Password
                  </label>
               </div>
               <div className="btn-center">
                  <button className="btn btn-primary">
                     <BiSave className="icon" />
                  </button>
               </div>
            </form>
         </div>
      </>
   );
};

ChangePassword.propTypes = {
   resetPassword: PropTypes.func.isRequired,
   removeAuthError: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { resetPassword, removeAuthError })(
   ChangePassword
);
