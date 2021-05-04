import React, { useState } from "react";
import PropTypes from "prop-types";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

import "./style.scss";

const Photo = ({ images, number, togglePhoto }) => {
   const [adminValues, setAdminValues] = useState({
      imgNum: number,
   });

   const { imgNum } = adminValues;

   const toLeft = () => {
      let num = imgNum - 1;
      if (num < 0) num = images.length - 1;
      setAdminValues((prev) => ({
         ...prev,
         imgNum: num,
      }));
   };

   const toRight = () => {
      let num = imgNum + 1;
      if (num === images.length - 1) num = 0;
      setAdminValues((prev) => ({
         ...prev,
         imgNum: num,
      }));
   };

   return (
      <div className="photo">
         <AiOutlineClose className="photo-close" onClick={togglePhoto} />
         <BsChevronDoubleLeft className="photo-arrow" onClick={toLeft} />
         <div
            className="photo-img"
            style={{
               backgroundImage: `url( ${images[imgNum].filePath})`,
            }}
         ></div>
         <BsChevronDoubleRight className="photo-arrow" onClick={toRight} />
      </div>
   );
};

Photo.propTypes = {
   images: PropTypes.array.isRequired,
   number: PropTypes.number.isRequired,
   togglePhoto: PropTypes.func.isRequired,
};

export default Photo;
