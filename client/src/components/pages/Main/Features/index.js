import React from "react";
import { GiDolphin, GiWaves, GiIsland, GiPartyPopper } from "react-icons/gi";

import "./style.scss";

const Features = () => {
   return (
      <section className="feature">
         <div className="feature-row">
            <div className="feature-box">
               <GiWaves className="feature-box-icon" />
               <h3 className="feature-box-header">Explore the sea</h3>
               <p className="feature-box-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
                  quia.
               </p>
            </div>
            <div className="feature-box">
               <GiDolphin className="feature-box-icon" />
               <h3 className="feature-box-header">
                  Get in contact with wild life
               </h3>
               <p className="feature-box-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
                  quia.
               </p>
            </div>
            <div className="feature-box">
               <GiIsland className="feature-box-icon" />
               <h3 className="feature-box-header">Visit several places</h3>
               <p className="feature-box-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
                  quia.
               </p>
            </div>
            <div className="feature-box">
               <GiPartyPopper className="feature-box-icon" />
               <h3 className="feature-box-header">
                  Have the time of your life
               </h3>
               <p className="feature-box-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
                  quia.
               </p>
            </div>
         </div>
      </section>
   );
};

export default Features;
