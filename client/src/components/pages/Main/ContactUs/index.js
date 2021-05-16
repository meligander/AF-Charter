import React from "react";
import { Link } from "react-router-dom";
import { IoIosSend } from "react-icons/io";

import "./style.scss";

const ContactUs = () => {
   return (
      <section className="contactus">
         <div className="contactus-card">
            <div className="contactus-card-form">
               <form className="form">
                  <h2 className="heading heading-secondary text-primary pb-2">
                     Send us a Message!
                  </h2>
                  <div className="form-group">
                     <input
                        type="text"
                        placeholder="Name"
                        required
                        id="name"
                        className="form-input"
                     />
                     <label htmlFor="name" className="form-label">
                        Name
                     </label>
                  </div>
                  <div className="form-group">
                     <input
                        type="email"
                        placeholder="Email address"
                        required
                        id="email"
                        className="form-input"
                     />
                     <label htmlFor="name" className="form-label">
                        Email address
                     </label>
                  </div>
                  <div className="form-group">
                     <textarea
                        className="form-input"
                        name="message"
                        id="message"
                        rows="4"
                        placeholder="Message"
                     ></textarea>
                     <label htmlFor="message" className="form-label">
                        Message
                     </label>
                  </div>
                  <div className="mt-3 center">
                     <button className="btn btn-primary">
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

export default ContactUs;
