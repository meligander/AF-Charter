import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { loadVessels } from "../../../../actions/vessel";
import { clearReservations } from "../../../../actions/reservation";

import "./style.scss";

const Fleet = ({
   loadVessels,
   vessels: { vessels, loading },
   clearReservations,
}) => {
   const [adminValues, setAdminValues] = useState({
      vesselNumb: 0,
   });

   const { vesselNumb } = adminValues;

   useEffect(() => {
      if (loading) loadVessels({ active: true });
   }, [loading, loadVessels]);

   return (
      !loading && (
         <section className="fleet">
            <h4 className="heading heading-secondary">
               Our Vessels
               <div className="underline"></div>
            </h4>
            {vessels.length !== 0 ? (
               <div className="fleet-gallery">
                  {vesselNumb !== 0 && (
                     <div className="fleet-gallery-left">
                        <div
                           style={{
                              backgroundImage: `url( ${
                                 vessels[vesselNumb - 1].mainImg.filePath
                              })`,
                           }}
                           className="fleet-gallery-img fleet-gallery-left-img img"
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
                           backgroundImage: `url( ${vessels[vesselNumb].mainImg.filePath})`,
                        }}
                        className="fleet-boat-img img"
                     ></div>
                     <p className="fleet-boat-price text">
                        From ${vessels[vesselNumb].prices[0].price}
                     </p>
                     <div className="text-center">
                        <Link
                           to={`/vessel/${vessels[vesselNumb]._id}`}
                           className="btn btn-fleet"
                           onClick={() => {
                              window.scroll(0, 0);
                              clearReservations();
                           }}
                        >
                           More Info
                        </Link>
                     </div>
                  </div>
                  {vesselNumb !== vessels.length - 1 && (
                     <div className="fleet-gallery-right">
                        <div
                           style={{
                              backgroundImage: `url( ${
                                 vessels[vesselNumb + 1].mainImg.filePath
                              })`,
                           }}
                           className="fleet-gallery-img fleet-gallery-right-img img"
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
      )
   );
};

Fleet.propTypes = {
   vessels: PropTypes.object.isRequired,
   loadVessels: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, { loadVessels, clearReservations })(
   Fleet
);
