import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { FaFacebookF } from "react-icons/fa";
import PropTypes from "prop-types";

import {
   facebookLogin,
   googleLogin,
   loginUser,
   sendPasswordLink,
   removeAuthError,
} from "../../../actions/auth";
import { setAlert } from "../../../actions/alert";
import { clearReservations } from "../../../actions/reservation";

import Alert from "../../shared/Alert";

import "./style.scss";

const Login = ({
   auth: { error },
   facebookLogin,
   googleLogin,
   loginUser,
   setAlert,
   sendPasswordLink,
   removeAuthError,
   clearReservations,
}) => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const { email, password } = formData;

   const [adminValues, setAdminValues] = useState({
      forgotPassword: false,
   });

   const { forgotPassword } = adminValues;

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
      if (error.constructor === Array && error.length > 0)
         removeAuthError(e.target.id);
   };

   const onSubmit = (e) => {
      e.preventDefault();

      if (forgotPassword) sendPasswordLink(email);
      else {
         loginUser(formData);
         clearReservations();
      }
   };

   const responseSuccessGoogle = (response) => {
      googleLogin({ tokenId: response.tokenId });
      clearReservations();
   };

   const responseErrorGoogle = (err) => {
      setAlert(err, "danger", "2");
   };

   const responseFacebook = (response) => {
      facebookLogin({
         accessToken: response.accessToken,
         userID: response.userID,
      });
      clearReservations();
   };

   return (
      <div className="section-login">
         <div className="login">
            <div className="login-card">
               <form onSubmit={onSubmit} className="form">
                  <h2 className="heading heading-secondary text-primary p-1">
                     {forgotPassword ? "Change Password" : "Login"}
                  </h2>
                  <Alert type="2" />
                  {forgotPassword ? (
                     <>
                        <div className="form-section">
                           <div className="form-group">
                              <input
                                 className={`form-input ${
                                    error.constructor === Array &&
                                    error.some(
                                       (value) => value.param === "email"
                                    )
                                       ? "invalid"
                                       : ""
                                 }`}
                                 type="email"
                                 name="email"
                                 value={email}
                                 onChange={(e) => onChange(e)}
                                 placeholder="Email"
                              />
                              <label htmlFor="email" className="form-label">
                                 Email
                              </label>
                           </div>
                        </div>
                        <div className="text-center">
                           <button type="submit" className="btn btn-tertiary">
                              Send Link
                           </button>
                           <p className="login-card-sign">
                              An email will be sent to the address so you can
                              change the password.
                              <br />
                              Please, check your spam folder before resendig the
                              email.
                           </p>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="form-section">
                           <div className="form-group">
                              <input
                                 className={`form-input ${
                                    error.constructor === Array &&
                                    error.some(
                                       (value) => value.param === "email"
                                    )
                                       ? "invalid"
                                       : ""
                                 }`}
                                 type="email"
                                 name="email"
                                 value={email}
                                 onChange={(e) => onChange(e)}
                                 placeholder="Email"
                              />
                              <label htmlFor="email" className="form-label">
                                 Email
                              </label>
                           </div>
                           <div className="form-group">
                              <input
                                 className={`form-input ${
                                    error.constructor === Array &&
                                    error.some(
                                       (value) => value.param === "password"
                                    )
                                       ? "invalid"
                                       : ""
                                 }`}
                                 type="password"
                                 value={password}
                                 name="password"
                                 onChange={(e) => onChange(e)}
                                 placeholder="Password"
                              />
                              <label htmlFor="name" className="form-label">
                                 Password
                              </label>
                           </div>
                        </div>
                        <div className="text-center">
                           <button type="submit" className="btn btn-tertiary">
                              Sign In
                           </button>
                           <p className="login-card-sign">
                              Don't have an account? &nbsp;
                              <Link className="btn-text" to="/signup">
                                 Sign up
                              </Link>
                           </p>
                           <p className="login-card-sign">
                              Forgot password? &nbsp;
                              <button
                                 type="button"
                                 className="btn-text"
                                 onClick={() =>
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       forgotPassword: true,
                                    }))
                                 }
                              >
                                 Change password
                              </button>
                           </p>
                           <div className="mt-3">
                              <GoogleLogin
                                 clientId={process.env.REACT_APP_GOOGLE_KEY}
                                 buttonText="Login"
                                 className="btn-google"
                                 onSuccess={responseSuccessGoogle}
                                 onFailure={responseErrorGoogle}
                                 cookiePolicy={"single_host_origin"}
                              />
                              <span className="btn-facebook">
                                 <FacebookLogin
                                    appId={process.env.REACT_APP_FACEBOOK_KEY}
                                    autoLoad={false}
                                    textButton={<FaFacebookF />}
                                    callback={responseFacebook}
                                 />
                              </span>
                           </div>
                        </div>
                     </>
                  )}
               </form>
               <div className="login-img img">
                  <h3 className="login-img-text">
                     Welcome <br /> Back!
                  </h3>
               </div>
            </div>
         </div>
      </div>
   );
};

Login.propTypes = {
   auth: PropTypes.object.isRequired,
   facebookLogin: PropTypes.func.isRequired,
   googleLogin: PropTypes.func.isRequired,
   loginUser: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   sendPasswordLink: PropTypes.func.isRequired,
   removeAuthError: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   facebookLogin,
   googleLogin,
   loginUser,
   setAlert,
   sendPasswordLink,
   removeAuthError,
   clearReservations,
})(Login);
