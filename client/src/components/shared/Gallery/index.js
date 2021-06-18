import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";

import Photo from "../../modal/Photo";
import PopUp from "../../modal/PopUp";

import "./style.scss";

const Gallery = ({ originalImages, editImages, deteleVesselImage }) => {
   const [adminValues, setAdminValues] = useState({
      togglePhoto: false,
      modalDelete: false,
      number: 0,
      toDelete: "",
   });

   const { togglePhoto, number, modalDelete, toDelete } = adminValues;

   const toggleModalDelte = (item) => {
      setAdminValues((prev) => ({
         ...prev,
         modalDelete: !modalDelete,
         ...(item && { toDelete: item }),
      }));
   };

   return (
      <div className="gallery row">
         {togglePhoto && (
            <Photo
               images={originalImages}
               number={number}
               togglePhoto={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     togglePhoto: false,
                  }))
               }
            />
         )}
         <PopUp
            type="confirmation"
            text="Are you sure you want to delete the image?"
            confirm={() => deteleVesselImage(toDelete)}
            toggleModal={modalDelete}
            setToggleModal={toggleModalDelte}
         />
         {originalImages.length > 0 &&
            originalImages.map((img, i) => (
               <div
                  key={i}
                  style={{
                     backgroundImage: `url( ${img.filePath})`,
                  }}
                  className="gallery-img img"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        number: i,
                        togglePhoto: true,
                     }))
                  }
               >
                  {editImages && (
                     <div className="btn-right">
                        <button
                           className="gallery-img-delete"
                           onClick={(e) => {
                              e.stopPropagation();
                              toggleModalDelte(img);
                           }}
                        >
                           <AiOutlineClose />
                        </button>
                     </div>
                  )}
               </div>
            ))}
      </div>
   );
};

Gallery.propTypes = {
   originalImages: PropTypes.array.isRequired,
   editImages: PropTypes.bool,
   deteleVesselImage: PropTypes.func,
};

export default Gallery;
