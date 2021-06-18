import React, { useEffect } from "react";
import { connect } from "react-redux";
import { GiSailboat } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import { ImLifebuoy } from "react-icons/im";
import { FaAnchor } from "react-icons/fa";
import PropTypes from "prop-types";

import { loadVessel } from "../../../actions/vessel";

import Gallery from "../../shared/Gallery";
import Tab from "../../shared/Tab";
import Schedule from "../../shared/Schedule";

import "./style.scss";

const Vessel = ({
   loadVessel,
   vessels: { vessel, loadingVessel: loading },
   match,
}) => {
   const _id = match.params.vessel_id;

   useEffect(() => {
      if (loading) loadVessel(_id);
   }, [loading, loadVessel, _id]);

   const Rates = () => {
      return (
         <ul>
            {vessel.prices.length > 0 &&
               vessel.prices.map((price, i) => (
                  <li key={i}>
                     <BiTimeFive className="icon" /> &nbsp;
                     <span className="text-primary">
                        {price.time} hours:
                     </span>{" "}
                     &nbsp; $ {price.price}
                  </li>
               ))}
         </ul>
      );
   };

   const Specifications = () => {
      return (
         <ul>
            <li>
               <ImLifebuoy className="icon" /> &nbsp;
               <span className="text-primary">
                  Sleeping places:
               </span> &nbsp; {vessel.peopleSleep}
            </li>
            <li>
               <ImLifebuoy className="icon" /> &nbsp;
               <span className="text-primary">Capacity:</span> &nbsp;{" "}
               {vessel.peopleOnBoard}
            </li>
         </ul>
      );
   };

   const Equipment = () => {
      return (
         <ul>
            {vessel.equipment.length > 0 &&
               vessel.equipment.map((item, i) => (
                  <li key={i}>
                     <FaAnchor className="icon" /> &nbsp; {item}
                  </li>
               ))}
            {vessel.waterToys.length > 0 && (
               <>
                  <li>
                     <FaAnchor className="icon" /> &nbsp; Water Toys:
                     <ul>
                        {vessel.waterToys.map((itemW, i2) => (
                           <li className="indentation" key={`w${i2}`}>
                              <BsDot className="icon" /> {itemW}
                           </li>
                        ))}
                     </ul>
                  </li>
               </>
            )}
         </ul>
      );
   };

   return (
      !loading && (
         <div className="vessel">
            <h2 className="heading heading-primary text-center">
               {vessel.name} <div className="underline"></div>
            </h2>
            <div
               className="vessel-img img"
               style={{
                  backgroundImage: `url( ${vessel.mainImg.filePath})`,
               }}
            ></div>
            <div className="row">
               <div className="row-item">
                  <h4 className="heading heading-secondary">About</h4>
                  We offer boat charters in the Miami area, giving a one-on-one
                  experience to all of our guests. Great boat to cruise around
                  Miami waters, comes with ice and some refreshments.
               </div>
               <div className="row-item">
                  <h4 className="heading heading-secondary">What to Bring</h4>
                  <ul>
                     <li>
                        <GiSailboat className="icon" /> &nbsp;Be sure to bring
                        food and drinks
                     </li>
                     <li>
                        <GiSailboat className="icon" /> &nbsp;Wear comfortable
                        clothing
                     </li>
                     <li>
                        <GiSailboat className="icon" /> &nbsp;Bring a sweater or
                        jacket on cool days
                     </li>
                  </ul>
               </div>
            </div>
            <div className="row">
               <Tab
                  tablist={["Rates", "Specifications", "Equipment"]}
                  panellist={[Rates, Specifications, Equipment]}
               />
            </div>
            <div className="row">
               <div>
                  <h4 className="heading heading-secondary ">Gallery</h4>
                  <Gallery originalImages={vessel.images} />
               </div>
            </div>
            <h4 className="heading heading-primary text-center mt-3">
               Availability
            </h4>
            <Schedule />
         </div>
      )
   );
};

Vessel.propTypes = {
   loadVessel: PropTypes.func.isRequired,
   vessels: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   loadVessel,
})(Vessel);
