import React from "react";
import { Link } from "react-router-dom";
import { IoIosSend } from "react-icons/io";

import "./style.scss";

const ContactUs = () => {
   return (
      <section className="contact">
         <div className="contact-card">
            <div className="contact-card-form">
               <form className="form">
                  <h2 className="heading heading-secondary text-primary pb-2">
                     Send us your questions!
                  </h2>
                  <div className="form-group">
                     <input
                        type="email"
                        placeholder="Email address"
                        required
                        id="name"
                        className="form-input"
                     />
                     <label for="name" className="form-label">
                        Email address
                     </label>
                  </div>
                  <div className="form-group">
                     <textarea
                        className="form-input"
                        name="questions"
                        id="questions"
                        rows="4"
                        placeholder="Questions"
                     ></textarea>
                     <label htmlFor="questions" className="form-label">
                        Questions
                     </label>
                  </div>
                  <div className="mt-3">
                     <button className="btn btn-primary">
                        Send <IoIosSend className="icon" />
                     </button>
                     <span className="contact-space">OR</span>
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
