import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { loadVessels } from "../../../../actions/vessel";

import "./style.scss";

const Fleet = ({ loadVessels, vessels: { vessels, loading } }) => {
   const [adminValues, setAdminValues] = useState({
      vesselNumb: 0,
      vesselsImages: [],
   });

   const { vesselNumb, vesselsImages } = adminValues;

   useEffect(() => {
      if (loading) {
         loadVessels({});
      } else {
         let vesselsImages = [];
         for (let x = 0; x < vessels.length; x++) {
            const vesselImgArray = vessels[x].images;
            for (let y = 0; y < vesselImgArray.length; y++) {
               if (vesselImgArray[y].default) {
                  vesselsImages.push(vesselImgArray[y].filePath);
                  break;
               }
            }
         }
         setAdminValues((prev) => ({
            ...prev,
            vesselsImages,
         }));
      }
   }, [loading, vessels, loadVessels]);

   return (
      <section className="fleet">
         <h4 className="heading heading-secondary">
            Our Vessels
            <div className="underline"></div>
         </h4>
         {!loading && vessels.length !== 0 ? (
            <div className="fleet-gallery">
               {vesselNumb !== 0 && (
                  <div className="fleet-gallery-left">
                     <div
                        style={{
                           ...(vesselsImages[vesselNumb - 1] !== undefined && {
                              backgroundImage: `url( ${
                                 vesselsImages[vesselNumb - 1]
                              })`,
                           }),
                        }}
                        className="fleet-gallery-img fleet-gallery-left-img"
                        onClick={() =>
                           setAdminValues((prev) => ({
                              ...prev,
                              vesselNumb: vesselNumb - 1,
                           }))
                        }
                     ></div>
                  </div>
               )}
               <div className="fleet-boat">
                  <h4 className="fleet-boat-name text">
                     {vessels[vesselNumb].name}
                  </h4>
                  <div
                     style={{
                        ...(vesselsImages[vesselNumb] !== undefined && {
                           backgroundImage: `url( ${vesselsImages[vesselNumb]})`,
                        }),
                     }}
                     className="fleet-boat-img "
                  ></div>
                  <p className="fleet-boat-price text">
                     From ${vessels[vesselNumb].prices[0].price}
                  </p>
                  <div className="text-center">
                     <Link
                        to={`/vessel/${vessels[vesselNumb]._id}`}
                        className="btn btn-fleet"
                     >
                        More Info
                     </Link>
                  </div>
               </div>
               {vesselNumb !== vessels.length - 1 && (
                  <div className="fleet-gallery-right">
                     <div
                        style={{
                           ...(vesselsImages[vesselNumb + 1] !== undefined && {
                              backgroundImage: `url( ${
                                 vesselsImages[vesselNumb + 1]
                              })`,
                           }),
                        }}
                        className="fleet-gallery-img fleet-gallery-right-img"
                        onClick={() =>
                           setAdminValues((prev) => ({
                              ...prev,
                              vesselNumb: vesselNumb + 1,
                           }))
                        }
                     ></div>
                  </div>
               )}
            </div>
         ) : (
            <p className="fleet-error">No Vessel Registered</p>
         )}
      </section>
   );
};

Fleet.propTypes = {
   vessels: PropTypes.object.isRequired,
   loadVessels: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, { loadVessels })(Fleet);
