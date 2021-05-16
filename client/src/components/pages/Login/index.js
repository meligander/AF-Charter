import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { FaFacebookF } from "react-icons/fa";
import PropTypes from "prop-types";

import { facebookLogin, googleLogin } from "../../../actions/auth";

import "./style.scss";

const Login = ({ facebookLogin, googleLogin }) => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const { email, password } = formData;

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const onSubmit = (e) => {
      e.preventDefault();
      //loginUser(formData);
   };

   const responseSuccessGoogle = (response) => {
      googleLogin({ tokenId: response.tokenId });
   };

   const responseErrorGoogle = (err) => {
      console.log(err);
   };

   const responseFacebook = (response) => {
      facebookLogin({
         accessToken: response.accessToken,
         userID: response.userID,
      });
   };

   return (
      <div className="section-login">
         <div className="login">
            <div className="login-card">
               <form onSubmit={onSubmit} className="form">
                  <h2 className="heading heading-secondary text-primary p-1">
                     Login
                  </h2>
                  <div className="form-section">
                     <div className="form-group">
                        <input
                           className="form-input"
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
                           className="form-input"
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
                     <div className="mt-3">
                        <GoogleLogin
                           clientId="890465295589-esuif8dhk3savc2evommitnc2amubg6g.apps.googleusercontent.com"
                           buttonText="Login"
                           className="btn-google"
                           onSuccess={responseSuccessGoogle}
                           onFailure={responseErrorGoogle}
                           cookiePolicy={"single_host_origin"}
                        />
                        <span className="btn-facebook">
                           <FacebookLogin
                              appId="309600937413006"
                              autoLoad={false}
                              textButton={<FaFacebookF />}
                              callback={responseFacebook}
                           />
                           {/* <span className="btn-facebook-login">Login</span> */}
                        </span>
                     </div>
                  </div>
               </form>
               <div className="login-img">
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
   facebookLogin: PropTypes.func.isRequired,
   googleLogin: PropTypes.func.isRequired,
};

export default connect(null, { facebookLogin, googleLogin })(Login);
