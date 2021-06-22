import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus, BiSave } from "react-icons/bi";
import PropTypes from "prop-types";

import {
   updateReservation,
   removeReservationError,
} from "../../../../actions/reservation";

import Alert from "../../../shared/Alert";

const ManifestTab = ({
   reservations: { reservation, error },
   updateReservation,
   removeReservationError,
}) => {
   const [manifest, setManifest] = useState([]);

   const [adminValues, setAdminValues] = useState({
      count: 0,
   });

   const { count } = adminValues;

   useEffect(() => {
      setManifest(reservation.manifest ? reservation.manifest : []);
   }, [reservation]);

   const onChange = (e, index) => {
      let newManifest = [...manifest];

      newManifest[index] = {
         ...newManifest[index],
         [e.target.name]:
            e.target.name === "cel"
               ? {
                    ...newManifest[index].cel,
                    [e.target.id.substring(1)]: e.target.value,
                 }
               : e.target.value,
      };

      setManifest(newManifest);
      if (
         error.constructor === Array &&
         error.length > 0 &&
         index === error[0].index
      )
         removeReservationError(e.target.name);
   };

   const addPassengerSet = () => {
      let newManifest = [...manifest];

      newManifest.push({
         _id: count,
         name: "",
         dateVisa: "",
         address: "",
         cel: {
            countryCode: "",
            areaCode: "",
            phoneNumb: "",
         },
      });
      setManifest(newManifest);
      setAdminValues((prev) => ({ ...prev, count: count + 1 }));
   };

   const deletePassengerSet = (index) => {
      let newManifest = [...manifest];

      newManifest.splice(index, 1);
      setManifest(newManifest);
   };

   const onSubmit = (e) => {
      e.preventDefault();
      updateReservation({ manifest }, reservation._id);
   };

   return (
      <form className="form" onSubmit={onSubmit}>
         <Alert type="3" />
         {manifest.length > 0 &&
            manifest.map((item, i) => (
               <div className="bg-hover-light" key={i}>
                  <h3 className="heading heading-secondary">
                     Passenger {i + 1}:
                  </h3>
                  <div className="form-group">
                     <div className="two-in-row">
                        <input
                           className={`form-input ${
                              error.constructor === Array &&
                              error.some(
                                 (value) =>
                                    value.param === "name" && value.index === i
                              )
                                 ? "invalid"
                                 : ""
                           }`}
                           type="text"
                           id={`n${i}`}
                           name="name"
                           placeholder="Name"
                           value={item.name}
                           onChange={(e) => onChange(e, i)}
                        />
                        <input
                           className="form-input"
                           type="date"
                           name="dateVisa"
                           id={`v${i}`}
                           value={item.dateVisa}
                           onChange={(e) => onChange(e, i)}
                        />
                     </div>
                     <div className="two-in-row">
                        <label
                           className={`form-label ${
                              item.name === "" ? "lbl" : ""
                           }`}
                        >
                           Name
                        </label>
                        <label className="form-label">
                           Visa Exp<span className="hide-sm">iration</span> Date
                        </label>
                     </div>
                  </div>
                  <div className="form-group">
                     <input
                        className={`form-input ${
                           error.constructor === Array &&
                           error.some(
                              (value) =>
                                 value.param === "address" && value.index === i
                           )
                              ? "invalid"
                              : ""
                        }`}
                        type="text"
                        value={item.address}
                        id={`a${i}`}
                        name="address"
                        onChange={(e) => onChange(e, i)}
                        placeholder="Address"
                     />
                     <label htmlFor={`a${i}`} className="form-label">
                        Address
                     </label>
                  </div>
                  <div className="form-group-phone">
                     <div className="form-group-phone-section">
                        <label
                           htmlFor={`${i}countryCode`}
                           className="form-label-show"
                        >
                           C<span className="hide-sm">ountry</span> Code
                        </label>
                        <input
                           name="cel"
                           className={`form-input ${
                              error.constructor === Array &&
                              error.some(
                                 (value) =>
                                    value.param === "cel" && value.index === i
                              )
                                 ? "invalid"
                                 : ""
                           }`}
                           type="number"
                           id={`${i}countryCode`}
                           placeholder={"+1"}
                           value={item.cel.countryCode}
                           onChange={(e) => onChange(e, i)}
                        />
                     </div>
                     <div className="form-group-phone-section">
                        <label
                           htmlFor={`${i}areaCode`}
                           className="form-label-show"
                        >
                           A<span className="hide-sm">rea</span> Code
                        </label>
                        <input
                           name="cel"
                           className={`form-input ${
                              error.constructor === Array &&
                              error.some(
                                 (value) =>
                                    value.param === "cel" && value.index === i
                              )
                                 ? "invalid"
                                 : ""
                           }`}
                           type="number"
                           id={`${i}areaCode`}
                           placeholder={800}
                           value={item.cel.areaCode}
                           onChange={(e) => onChange(e, i)}
                        />
                     </div>
                     <div className="form-group-phone-section">
                        <label
                           htmlFor={`${i}phoneNumb`}
                           className="form-label-show"
                        >
                           Phone Number
                        </label>
                        <input
                           name="cel"
                           className={`form-input ${
                              error.constructor === Array &&
                              error.some(
                                 (value) =>
                                    value.param === "cel" && value.index === i
                              )
                                 ? "invalid"
                                 : ""
                           }`}
                           type="number"
                           id={`${i}phoneNumb`}
                           placeholder={8000000}
                           value={item.cel.phoneNumb}
                           onChange={(e) => onChange(e, i)}
                        />
                     </div>
                  </div>
                  <label className="form-label-show">Cellphone</label>
                  <div
                     className="text-right heading-secondary"
                     style={{ marginTop: "-1rem" }}
                  >
                     <button
                        type="button"
                        className="btn-text danger"
                        onClick={() => deletePassengerSet(i)}
                     >
                        <AiOutlineDelete className="icon" />
                     </button>
                  </div>
               </div>
            ))}
         <div className="btn-right">
            <button
               className="btn btn-secondary"
               onClick={addPassengerSet}
               type="button"
            >
               <BiPlus className="icon" /> Passenger
            </button>
         </div>
         <div className="btn-center mt-4">
            <button type="submit" className="btn btn-primary">
               <BiSave className="icon" />
            </button>
         </div>
      </form>
   );
};

ManifestTab.propTypes = {
   users: PropTypes.object.isRequired,
   reservations: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   updateReservation: PropTypes.func.isRequired,
   removeReservationError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   reservations: state.reservations,
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   updateReservation,
   removeReservationError,
})(ManifestTab);
