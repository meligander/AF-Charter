import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import PropTypes from "prop-types";

import { removeAuthError, sendEmail } from "../../../../actions/auth";

import Alert from "../../../shared/Alert";

import "./style.scss";

const ContactUs = ({
   auth: { isAuthenticated, loggedUser, error },
   sendEmail,
   removeAuthError,
}) => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
   });

   const { name, email, message } = formData;

   useEffect(() => {
      if (isAuthenticated)
         setFormData((prev) => ({
            ...prev,
            name: `${loggedUser.name} ${loggedUser.lastname}`,
            email: loggedUser.email,
         }));
   }, [isAuthenticated, loggedUser]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.id]: e.target.value,
      }));

      if (error.constructor === Array && error.length > 0)
         removeAuthError(e.target.id);
   };

   return (
      <section className="contactus">
         <div className="contactus-card img">
            <div className="contactus-card-form">
               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     sendEmail(formData);
                  }}
               >
                  <h2 className="heading heading-secondary text-primary pb-2">
                     Send us a Message!
                  </h2>
                  <Alert type="2" />
                  <div className="form-group">
                     <input
                        type="text"
                        placeholder="Name"
                        onChange={onChange}
                        value={name}
                        id="name"
                        className={`form-input ${
                           error.constructor === Array &&
                           error.some((value) => value.param === "name")
                              ? "invalid"
                              : ""
                        }`}
                     />
                     <label htmlFor="name" className="form-label">
                        Name
                     </label>
                  </div>
                  <div className="form-group">
                     <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={onChange}
                        id="email"
                        className={`form-input ${
                           error.constructor === Array &&
                           error.some((value) => value.param === "lastname")
                              ? "invalid"
                              : ""
                        }`}
                     />
                     <label htmlFor="name" className="form-label">
                        Email address
                     </label>
                  </div>
                  <div className="form-group">
                     <textarea
                        className={`form-input ${
                           error.constructor === Array &&
                           error.some((value) => value.param === "message")
                              ? "invalid"
                              : ""
                        }`}
                        value={message}
                        id="message"
                        onChange={onChange}
                        rows="4"
                        placeholder="Message"
                     ></textarea>
                     <label htmlFor="message" className="form-label">
                        Message
                     </label>
                  </div>
                  <div className="mt-3 center">
                     <button type="submit" className="btn btn-primary">
                        Send <IoIosSend className="icon" />
                     </button>
                     <span className="contactus-space">OR</span>
                     <Link to="/contact" className="btn btn-tertiary">
                        Contact Us
                     </Link>
                  </div>
               </form>
            </div>
         </div>
      </section>
   );
};

ContactUs.propTypes = {
   auth: PropTypes.object.isRequired,
   removeAuthError: PropTypes.func.isRequired,
   sendEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { sendEmail, removeAuthError })(
   ContactUs
);
