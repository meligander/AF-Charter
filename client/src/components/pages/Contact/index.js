import React from "react";
import { AiTwotonePhone } from "react-icons/ai";
import { SiMailDotRu } from "react-icons/si";
import { GrInstagram } from "react-icons/gr";
import { ImFacebook, ImTwitter, ImLocation } from "react-icons/im";

import "./style.scss";

const Contact = () => {
   return (
      <div className="contact">
         <div className="contact-img">
            <h2 className="contact-img-text heading heading-primary">
               Let's have a talk
            </h2>
         </div>
         <div className="contact-row">
            <div className="contact-google">
               <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d114956.27897113624!2d-80.25004247514185!3d25.79091200000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2381c2f228e6c91!2sSea%20Isle%20Marina%20%26%20Yachting%20Center!5e0!3m2!1ses!2sus!4v1619312544186!5m2!1ses!2sus"
                  allowfullscreen=""
                  title="AF Charter address"
                  loading="lazy"
               ></iframe>
            </div>
            <div className="contact-meet">
               <h2 className="contact-header">Meet Us</h2>
               <ul className="contact-meet-list">
                  <li className="contact-meet-list-item">
                     <AiTwotonePhone className="contact-meet-list-icon" /> +1
                     (305) 377-7369
                  </li>
                  <li className="contact-meet-list-item">
                     <SiMailDotRu className="contact-meet-list-icon" />{" "}
                     afcharter@gmail.com
                  </li>
                  <li className="contact-meet-list-item">
                     <ImLocation className="contact-meet-list-icon" /> 1635 N
                     Bayshore Dr, Miami
                  </li>
               </ul>
            </div>
            <div className="contact-findus">
               <h2 className="contact-header">Find Us On</h2>
               <div className="contact-findus-icons">
                  <a
                     className="contact-findus-icons-item"
                     href="https://www.facebook.com"
                  >
                     <ImFacebook />
                  </a>
                  <a
                     className="contact-findus-icons-item"
                     href="https://www.instagram.com"
                  >
                     <GrInstagram />
                  </a>
                  <a
                     className="contact-findus-icons-item"
                     href="https://twitter.com"
                  >
                     <ImTwitter />
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Contact;
