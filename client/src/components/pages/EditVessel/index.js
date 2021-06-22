import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { BiPlus, BiSave } from "react-icons/bi";
import { ImImages } from "react-icons/im";

import {
   loadVessel,
   registerUpdateVessel,
   removeVesselError,
} from "../../../actions/vessel";

import Alert from "../../shared/Alert";

import "./style.scss";

const EditVessel = ({
   vessels: { vessel, loadingVessel, error },
   loadVessel,
   registerUpdateVessel,
   removeVesselError,
   match,
}) => {
   const _id = match.params.vessel_id;
   const today = moment().format("YYYY-MM-DD");

   const [formData, setFormData] = useState({
      name: "",
      brand: "",
      year: "",
      equipment: [],
      waterToys: [],
      prices: [],
      peopleOnBoard: "",
      peopleSleep: "",
      active: true,
      img: "",
      date: "",
   });

   const [adminValues, setAdminValues] = useState({
      previewSource: "",
      fileInputState: "",
      selectedFile: "",
      allEquipment: [
         "Lifeboat",
         "Lifejackets",
         "Power Generators",
         "Electric Fridge",
         "Fishing Equipment",
      ],
      allWaterToys: [
         "Rolling Floating Mat",
         "Water Noodles",
         "Inflatable Toys",
      ],
   });

   const {
      name,
      brand,
      year,
      peopleOnBoard,
      peopleSleep,
      active,
      date,
      img,
      prices,
      equipment,
      waterToys,
   } = formData;

   const {
      previewSource,
      fileInputState,
      selectedFile,
      allEquipment,
      allWaterToys,
   } = adminValues;

   useEffect(() => {
      if (_id) {
         if (loadingVessel) loadVessel(_id);
         else {
            setFormData((prev) => ({
               ...prev,
               name: vessel.name,
               brand: vessel.brand,
               active: vessel.active,
               date: moment(vessel.date).format("YYYY-MM-DD"),
               ...(vessel.year && { year: vessel.year }),
               ...(vessel.prices.length > 0 && {
                  prices: vessel.prices,
               }),
               ...(vessel.peopleOnBoard && {
                  peopleOnBoard: vessel.peopleOnBoard,
               }),
               ...(vessel.peopleSleep && {
                  peopleSleep: vessel.peopleSleep,
               }),
               ...(vessel.equipment && { equipment: vessel.equipment }),
               ...(vessel.waterToys && { waterToys: vessel.waterToys }),
            }));

            if (vessel.mainImg && vessel.mainImg.fileName !== "")
               setAdminValues((prev) => ({
                  ...prev,
                  previewSource: vessel.mainImg.filePath,
                  fileInputState: true,
               }));
         }
      }
   }, [_id, loadingVessel, loadVessel, vessel]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         ...(!e.target.name
            ? {
                 [e.target.id]:
                    e.target.id === "active"
                       ? e.target.checked
                       : e.target.value,
              }
            : {
                 [e.target.name]: e.target.checked
                    ? [...prev[e.target.name], e.target.value]
                    : prev[e.target.name].filter(
                         (item) => item !== e.target.value
                      ),
              }),
      }));

      if (error.constructor === Array && error.length > 0)
         removeVesselError(e.target.id);
   };

   const onChangePrice = (e) => {
      let newPrices = [...prices];

      newPrices[e.target.id][e.target.name] = e.target.value;

      setFormData((prev) => ({
         ...prev,
         prices: newPrices,
      }));
   };

   const onChangeImg = (e) => {
      if (e.target.value) {
         const file = e.target.files[0];
         previewFile(file, e.target.value);
      }
   };

   const previewFile = (file, state) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
         setAdminValues((prev) => ({
            ...prev,
            previewSource: reader.result,
            selectedFile: file,
            fileInputState: state,
         }));
      };
   };

   const addPriceSet = () => {
      let newPrices = [...prices];
      newPrices.push({
         time: "",
         price: "",
      });
      setFormData((prev) => ({ ...prev, prices: newPrices }));
   };

   const deletePriceSet = (i) => {
      let newPrices = [...prices];
      newPrices.splice(i, 1);
      setFormData((prev) => ({ ...prev, prices: newPrices }));
   };

   const onSubmit = (e) => {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();

      const uploadImg = new FormData();
      if (selectedFile !== "")
         uploadImg.append("file", selectedFile, selectedFile.name);

      const data = {
         ...formData,
         ...(selectedFile !== "" && {
            img: selectedFile.name,
            formImg: uploadImg,
         }),
      };
      registerUpdateVessel(data, _id && _id);
   };

   return (
      <div className="edit-vessel">
         <h2 className="heading heading-primary text-primary">
            {_id ? "Edit" : "New"} Vessel
         </h2>
         <Alert type="2" />
         <form className="form" onSubmit={onSubmit}>
            <div className="form-img">
               <img
                  className="form-img-prev"
                  src={
                     previewSource !== ""
                        ? previewSource
                        : img.filePath
                        ? img.filePath
                        : "https://images.vexels.com/media/users/3/166186/isolated/preview/e05e41c1b3d17fd25cb950dfe2e2ed6d-cabin-cruiser-boat-silhouette-by-vexels.png"
                  }
                  alt="chosen img"
               />
               <div
                  className={`form-img-file ${fileInputState ? "success" : ""}`}
               >
                  <input
                     type="file"
                     onChange={onChangeImg}
                     className="form-img-file-upl"
                  />
                  <span>
                     <AiOutlineCloudUpload className="form-img-icon" />
                     &nbsp; Upload Main Image
                  </span>
               </div>
            </div>
            <p className="edit-vessel-subtitle">Main Info:</p>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className={`form-input ${
                        error.constructor === Array &&
                        error.some((value) => value.param === "name")
                           ? "invalid"
                           : ""
                     }`}
                     type="text"
                     id="name"
                     placeholder="Name"
                     value={name}
                     onChange={onChange}
                  />
                  <input
                     className={`form-input ${
                        error.constructor === Array &&
                        error.some((value) => value.param === "brand")
                           ? "invalid"
                           : ""
                     }`}
                     type="text"
                     id="brand"
                     placeholder="Brand"
                     value={brand}
                     onChange={onChange}
                  />
               </div>
               <div className="two-in-row">
                  <label className={`form-label ${name === "" ? "lbl" : ""}`}>
                     Name
                  </label>
                  <label className={`form-label ${brand === "" ? "lbl" : ""}`}>
                     Brand
                  </label>
               </div>
            </div>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="number"
                     id="year"
                     placeholder="Year"
                     value={year}
                     onChange={onChange}
                  />
                  <input
                     className="form-input"
                     type="date"
                     disabled
                     value={date === "" ? today : date}
                  />
               </div>
               <div className="two-in-row">
                  <label className={`form-label ${year === "" ? "lbl" : ""}`}>
                     Year
                  </label>
                  <label className="form-label">Date of creation</label>
               </div>
            </div>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="number"
                     id="peopleOnBoard"
                     placeholder="Capacity"
                     value={peopleOnBoard}
                     onChange={onChange}
                  />
                  <input
                     className="form-input"
                     type="number"
                     id="peopleSleep"
                     placeholder="Sleeping Places"
                     value={peopleSleep}
                     onChange={onChange}
                  />
               </div>
               <div className="two-in-row">
                  <label
                     className={`form-label ${
                        peopleOnBoard === "" ? "lbl" : ""
                     }`}
                  >
                     Capacity
                  </label>
                  <label
                     className={`form-label ${peopleSleep === "" ? "lbl" : ""}`}
                  >
                     Sleeping Places
                  </label>
               </div>
            </div>
            <div className="form-group checkbox-group">
               <input
                  className="form-input-checkbox"
                  type="checkbox"
                  value={active}
                  onChange={onChange}
                  checked={active}
                  id="active"
               />
               <label className="form-lbl-checkbox" htmlFor="active">
                  Active
               </label>
            </div>
            {_id && (
               <div className="btn-right">
                  <Link
                     className="btn btn-secondary"
                     onClick={() => window.scroll(0, 0)}
                     to={`/images/${_id}`}
                  >
                     <ImImages className="icon" />
                     &nbsp; <span className="hide-sm">Manage </span>Images
                  </Link>
               </div>
            )}

            <p className="edit-vessel-subtitle">Prices:</p>
            {prices.length > 0 &&
               prices.map((item, i) => (
                  <div className="form-group several-input" key={i}>
                     <div>
                        <div className="two-in-row">
                           <input
                              className="form-input"
                              type="number"
                              id={i}
                              name="time"
                              placeholder="Hours"
                              value={item.time}
                              onChange={onChangePrice}
                           />
                           <input
                              className="form-input"
                              type="number"
                              id={i}
                              name="price"
                              placeholder="Price"
                              value={item.price}
                              onChange={onChangePrice}
                           />
                        </div>
                        <div className="two-in-row">
                           <label
                              className={`form-label ${
                                 item.time === "" ? "lbl" : ""
                              }`}
                           >
                              Hours
                           </label>
                           <label
                              className={`form-label ${
                                 item.price === "" ? "lbl" : ""
                              }`}
                           >
                              Price
                           </label>
                        </div>
                     </div>
                     <button
                        className="btn-text danger"
                        onClick={() => deletePriceSet(i)}
                     >
                        <AiOutlineDelete className="icon" />
                     </button>
                  </div>
               ))}
            <div className="btn-right">
               <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={addPriceSet}
               >
                  <BiPlus className="icon" /> Price
               </button>
            </div>
            <p className="edit-vessel-subtitle">Equipment:</p>

            <div className="checkbox-group form-group">
               {allEquipment.map((equip, i) => (
                  <React.Fragment key={i}>
                     <input
                        className="form-input-checkbox"
                        type="checkbox"
                        onChange={onChange}
                        checked={equipment.some((item) => item === equip)}
                        name="equipment"
                        value={equip}
                        id={`e${i}`}
                     />
                     <label className="form-lbl-checkbox" htmlFor={`e${i}`}>
                        {equip}
                     </label>
                  </React.Fragment>
               ))}
            </div>
            <p className="edit-vessel-subtitle">Water Toys:</p>
            <div className="form-group checkbox-group">
               {allWaterToys.map((toy, i) => (
                  <React.Fragment key={i}>
                     <input
                        className="form-input-checkbox"
                        type="checkbox"
                        onChange={onChange}
                        checked={waterToys.some((item) => item === toy)}
                        name="waterToys"
                        value={toy}
                        id={`wt${i}`}
                     />
                     <label className="form-lbl-checkbox" htmlFor={`wt${i}`}>
                        {toy}
                     </label>
                  </React.Fragment>
               ))}
            </div>
            <div className="btn-center pt-5">
               <button type="submit" className="btn btn-primary">
                  <BiSave className="icon" /> Save
               </button>
            </div>
         </form>
      </div>
   );
};

EditVessel.propTypes = {
   vessels: PropTypes.object.isRequired,
   loadVessel: PropTypes.func.isRequired,
   registerUpdateVessel: PropTypes.func.isRequired,
   removeVesselError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   loadVessel,
   registerUpdateVessel,
   removeVesselError,
})(EditVessel);
