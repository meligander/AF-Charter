import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadVessels } from "../../../actions/vessel";

import "./style.scss";

import Header from "../../layout/Header";

const Main = ({ loadVessels, vessels: { vessels, loading } }) => {
   const [adminValues, setAdminValues] = useState({
      vesselNumb: 0,
   });

   const { vesselNumb } = adminValues;

   useEffect(() => {
      if (loading) {
         loadVessels({});
      }
   }, [loading, loadVessels]);

   return (
      <Fragment>
         <Header />
         <div className="main">
            <h4 className="heading heading-secondary">
               Our Vessels
               <div className="underline"></div>
            </h4>
            {!loading && vessels.length !== 0 ? (
               <div className="main-gallery">
                  {vesselNumb !== 0 && (
                     <div className="main-gallery-left">
                        <img
                           src={vessels[vesselNumb - 1].images[0].filePath}
                           alt="AF-Charter Vessel"
                           className="main-gallery-left-img"
                           onClick={() =>
                              setAdminValues((prev) => ({
                                 ...prev,
                                 vesselNumb: vesselNumb - 1,
                              }))
                           }
                        />
                     </div>
                  )}
                  <div className="main-boat">
                     <h4 className="main-boat-name text">
                        {vessels[vesselNumb].name}
                     </h4>
                     <img
                        className="main-boat-img "
                        src={vessels[vesselNumb].images[0].filePath}
                        alt="AF-Charter Vessel"
                     />
                     <p className="main-boat-price text">
                        From ${vessels[vesselNumb].prices[0].price}
                     </p>
                     <div className="text-center">
                        <button className="main-boat-btn">More Info</button>
                     </div>
                  </div>
                  {vesselNumb !== vessels.length - 1 && (
                     <div className="main-gallery-right">
                        <img
                           src={vessels[vesselNumb + 1].images[0].filePath}
                           alt="AF-Charter Vessel"
                           className="main-gallery-right-img"
                           onClick={() =>
                              setAdminValues((prev) => ({
                                 ...prev,
                                 vesselNumb: vesselNumb + 1,
                              }))
                           }
                        />
                     </div>
                  )}
               </div>
            ) : (
               <p className="main-error">No Vessel Registered</p>
            )}
         </div>
      </Fragment>
   );
};

Main.propTypes = {
   vessels: PropTypes.object.isRequired,
   loadVessels: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, { loadVessels })(Main);
