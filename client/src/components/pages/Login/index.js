import React, { useState } from "react";
import { Link } from "react-router-dom";
//import PropTypes from 'prop-types'

import "./style.scss";

const Login = () => {
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
                        <Link className="btn-text" to="signup">
                           Sign up
                        </Link>
                     </p>
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

/* Login.propTypes = {}; */

export default Login;
