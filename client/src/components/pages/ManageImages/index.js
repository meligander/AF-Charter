import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadVessel, deleteImage } from "../../../actions/vessel";

import Gallery from "../../shared/Gallery";
import DropZone from "../../shared/DropZone";
import Alert from "../../shared/Alert";

const ManageImages = ({
   vessels: { vessel, loadingVessel },
   loadVessel,
   deleteImage,
   match,
}) => {
   const _id = match.params.vessel_id;

   useEffect(() => {
      if (loadingVessel) loadVessel(_id);
   }, [loadingVessel, loadVessel, _id]);

   const deteleVesselImage = (img) => {
      deleteImage(_id, img);
   };

   return (
      <div>
         {!loadingVessel && (
            <>
               <h2 className="heading heading-primary text-primary mb-5">
                  Manage Images - {vessel.name}
               </h2>
               <Alert type="2" />
               <Gallery
                  originalImages={vessel.images}
                  editImages={true}
                  deteleVesselImage={deteleVesselImage}
               />
               <DropZone _id={_id} clearImages={() => loadVessel(_id)} />
            </>
         )}
      </div>
   );
};

ManageImages.propTypes = {
   vessels: PropTypes.object.isRequired,
   loadVessel: PropTypes.func.isRequired,
   deleteImage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, { loadVessel, deleteImage })(
   ManageImages
);
