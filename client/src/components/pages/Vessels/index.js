import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaUsers, FaBed } from "react-icons/fa";
import { BsArrowRightShort } from "react-icons/bs";
import PropTypes from "prop-types";

import { loadVessels, clearVessels } from "../../../actions/vessel";

import "./style.scss";

const Vessels = ({
   loadVessels,
   clearVessels,
   vessels: { vessels, loading },
}) => {
   useEffect(() => {
      if (loading) loadVessels({});
   }, [loadVessels, loading]);

   return (
      <>
         <h3 className="heading heading-primary text-center text-secondary pb-4">
            Pick one of our boats!
            <div className="underline"></div>
         </h3>
         <div className="vessels">
            {!loading &&
               vessels.length > 0 &&
               vessels.map((vessel, i) => (
                  <div className="vessels-item" key={i}>
                     <figure className="vessels-figure">
                        <div
                           className="vessels-figure-img img"
                           style={{
                              backgroundImage: `url( ${vessel.mainImg.filePath})`,
                           }}
                        ></div>
                        <figcaption className="vessels-figure-caption">
                           <p className="vessels-figure-caption-price">
                              From ${vessel.prices[0].price}
                           </p>
                           <p className="vessels-figure-caption-icon">
                              <FaUsers className="icon" />
                              {vessel.peopleOnBoard}
                           </p>
                           <p className="vessels-figure-caption-icon">
                              <FaBed className="icon" /> {vessel.peopleSleep}
                           </p>
                           <Link
                              to={`/vessel/${vessel._id}`}
                              className="btn-text light"
                              onClick={clearVessels}
                           >
                              More Info
                              <BsArrowRightShort className="icon" />
                           </Link>
                        </figcaption>
                     </figure>
                     <p className="vessels-item-name">{vessel.name}</p>
                  </div>
               ))}
         </div>
      </>
   );
};

Vessels.propTypes = {
   loadVessels: PropTypes.func.isRequired,
   clearVessels: PropTypes.func.isRequired,
   vessels: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, { loadVessels, clearVessels })(Vessels);
