import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BiSave } from "react-icons/bi";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

import { loadVessels } from "../../../actions/vessel";
import { loadUsers } from "../../../actions/user";
import { updateLoadingSpinner } from "../../../actions/mixvalues";
import {
   loadMaintenance,
   registerUpdateMaintenance,
   removeMaintenanceError,
   getNewJobNumber,
   closeReopenMaintenance,
} from "../../../actions/maintenance";

import Alert from "../../shared/Alert";
import PopUp from "../../modal/PopUp";

const EditVessel = ({
   vessels: { vessels, loading: loadingVessels },
   maintenances: {
      maintenance: maintenanceItem,
      loadingMaintenance,
      otherData: { newJobNumber },
      error,
   },
   users: { usersAux, loadingAux },
   loadVessels,
   loadUsers,
   loadMaintenance,
   registerUpdateMaintenance,
   removeMaintenanceError,
   getNewJobNumber,
   closeReopenMaintenance,
   updateLoadingSpinner,
   match,
}) => {
   const _id = match.params.maintenance_id;

   const [formData, setFormData] = useState({
      jobNumber: "",
      newNumber: true,
      vessel: "",
      system: "",
      type: "",
      houlout: false,
      timeToDetect: "",
      paymentToDetect: "",
      mechanicToDetect: "",
      issue: "",
      mechanicToFix: "",
      maintenance: "",
      tempFix: false,
      permFix: false,
      timeToFix: "",
      paymentToFix: "",
   });

   const [adminValues, setAdminValues] = useState({
      modalClose: false,
   });

   const {
      jobNumber,
      newNumber,
      vessel,
      system,
      type,
      houlout,
      timeToDetect,
      paymentToDetect,
      mechanicToDetect,
      issue,
      mechanicToFix,
      maintenance,
      tempFix,
      permFix,
      timeToFix,
      paymentToFix,
   } = formData;

   const { modalClose } = adminValues;

   useEffect(() => {
      if (loadingAux) {
         updateLoadingSpinner(true);
         loadVessels({ active: true }, true);
         loadUsers({ active: true, type: "mechanic" }, false);
      } else {
         if (!_id) updateLoadingSpinner(false);
      }
      if (_id) {
         if (!loadingAux)
            if (loadingMaintenance) loadMaintenance(_id);
            else {
               setFormData((prev) => ({
                  ...prev,
                  jobNumber: maintenanceItem.jobNumber,
                  vessel: maintenanceItem.vessel,
                  ...(maintenanceItem.system && {
                     system: maintenanceItem.system,
                  }),
                  ...(maintenanceItem.type && { type: maintenanceItem.type }),
                  ...(maintenanceItem.houlout !== undefined && {
                     houlout: maintenanceItem.houlout,
                  }),
                  ...(maintenanceItem.timeToDetect && {
                     timeToDetect: maintenanceItem.timeToDetect,
                  }),
                  ...(maintenanceItem.paymentToDetect && {
                     paymentToDetect: maintenanceItem.paymentToDetect,
                  }),
                  ...(maintenanceItem.issue && {
                     issue: maintenanceItem.issue,
                  }),
                  ...(maintenanceItem.mechanicToFix && {
                     mechanicToFix: maintenanceItem.mechanicToFix,
                  }),
                  ...(maintenanceItem.maintenance && {
                     maintenance: maintenanceItem.maintenance,
                  }),
                  ...(maintenanceItem.tempFix !== undefined && {
                     tempFix: maintenanceItem.tempFix,
                  }),
                  ...(maintenanceItem.permFix !== undefined && {
                     permFix: maintenanceItem.permFix,
                  }),
                  ...(maintenanceItem.timeToFix && {
                     timeToFix: maintenanceItem.timeToFix,
                  }),
                  ...(maintenanceItem.paymentToFix && {
                     paymentToFix: maintenanceItem.paymentToFix,
                  }),
               }));
            }
      } else {
         if (newJobNumber !== "")
            setFormData((prev) => ({ ...prev, jobNumber: newJobNumber }));
      }
   }, [
      _id,
      loadMaintenance,
      loadUsers,
      loadVessels,
      maintenanceItem,
      loadingAux,
      loadingMaintenance,
      newJobNumber,
      updateLoadingSpinner,
   ]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.id ? e.target.checked : e.target.value,
      }));

      if (e.target.name === "vessel") getNewJobNumber(e.target.value);

      if (e.target.name === "newNumber")
         if (!e.target.checked)
            setFormData((prev) => ({ ...prev, jobNumber: "" }));
         else setFormData((prev) => ({ ...prev, jobNumber: newJobNumber }));

      if (error.constructor === Array && error.length > 0)
         removeMaintenanceError(e.target.id);
   };

   const onSubmit = (e) => {
      e.preventDefault();
      registerUpdateMaintenance(formData, _id && _id);
   };

   return (
      !loadingVessels &&
      !loadingAux &&
      ((_id && !loadingMaintenance) || !_id) && (
         <>
            <PopUp
               type="confirmation"
               confirm={() => {
                  closeReopenMaintenance(_id, !maintenanceItem.closeDate);
                  registerUpdateMaintenance(formData, _id);
               }}
               setToggleModal={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     modalClose: !modalClose,
                  }))
               }
               toggleModal={modalClose}
               text={`Are you sure you want to ${
                  maintenanceItem && maintenanceItem.closeDate
                     ? "reopen"
                     : "close"
               } the maintenace?`}
            />
            <h2 className="heading heading-primary text-primary">
               {_id ? "Edit" : "New"} Maintenance
            </h2>
            <Alert type="2" />
            <form className="form" onSubmit={onSubmit}>
               <div className="form-group">
                  <select
                     name="vessel"
                     className={`form-input ${
                        error.constructor === Array &&
                        error.some((value) => value.param === "vessel")
                           ? "invalid"
                           : ""
                     }`}
                     onChange={onChange}
                     value={vessel}
                  >
                     <option value="">* Select Vessel</option>
                     {vessels.length > 0 &&
                        vessels.map((vessel) => (
                           <option key={vessel._id} value={vessel._id}>
                              {vessel.name}
                           </option>
                        ))}
                  </select>
                  <label
                     htmlFor="vessel"
                     className={`form-label ${vessel === "" ? "lbl" : ""}`}
                  >
                     User Type
                  </label>
               </div>
               {vessel !== "" && (
                  <div className="form-group">
                     <div
                        className="two-in-row"
                        style={{ alignItems: "center" }}
                     >
                        <input
                           className={`form-input ${
                              error.constructor === Array &&
                              error.some((value) => value.param === "jobNumber")
                                 ? "invalid"
                                 : ""
                           }`}
                           type="text"
                           name="jobNumber"
                           placeholder="Job Number"
                           value={jobNumber}
                           disabled={newNumber}
                           onChange={onChange}
                        />
                        {!_id && (
                           <div style={{ padding: "0 2rem" }}>
                              <input
                                 className="form-input-checkbox"
                                 type="checkbox"
                                 onChange={onChange}
                                 checked={newNumber}
                                 name="newNumber"
                                 id="newNumber"
                              />
                              <label
                                 className="form-lbl-switch"
                                 htmlFor="newNumber"
                              ></label>
                           </div>
                        )}
                     </div>
                     <div className="two-in-row">
                        <label
                           className={`form-label ${
                              jobNumber === "" ? "lbl" : ""
                           }`}
                        >
                           Job Number
                        </label>
                        {!_id && (
                           <label
                              style={{ width: "11%" }}
                              className="form-label"
                           >
                              New Job
                           </label>
                        )}
                     </div>
                  </div>
               )}
               <div className="form-group">
                  <div className="two-in-row">
                     <select
                        name="system"
                        className="form-input"
                        onChange={onChange}
                        value={system}
                     >
                        <option value="">* Select System</option>
                        <option value="Electric">Electric</option>
                        <option value="Engeneering">Engeneering</option>
                        <option value="Auxiliary">Auxiliary</option>
                        <option value="Fire System">Fire System</option>
                        <option value="Sewer">Sewer</option>
                     </select>
                     <select
                        name="type"
                        className="form-input"
                        onChange={onChange}
                        value={type}
                     >
                        <option value="">* Select Type</option>
                        <option value="Minor">Minor</option>
                        <option value="Restrictive">Restrictive</option>
                        <option value="Disabling">Disabling</option>
                        <option value="Mayor">Mayor</option>
                     </select>
                  </div>
                  <div className="two-in-row">
                     <label
                        className={`form-label ${system === "" ? "lbl" : ""}`}
                     >
                        System
                     </label>
                     <label
                        className={`form-label ${type === "" ? "lbl" : ""}`}
                     >
                        Type
                     </label>
                  </div>
               </div>
               <div className="form-group">
                  <textarea
                     placeholder="Issue"
                     name="issue"
                     className={`form-input ${
                        error.constructor === Array &&
                        error.some((value) => value.param === "issue")
                           ? "invalid"
                           : ""
                     }`}
                     value={issue}
                     onChange={onChange}
                     rows="3"
                  ></textarea>
                  <label className={`form-label ${issue === "" ? "lbl" : ""}`}>
                     Issue
                  </label>
               </div>
               <div className="form-group checkbox-group">
                  <input
                     className="form-input-checkbox"
                     type="checkbox"
                     onChange={onChange}
                     checked={houlout}
                     id="houlout"
                     name="houlout"
                  />
                  <label className="form-lbl-checkbox" htmlFor="houlout">
                     Houlout
                  </label>
               </div>
               <h4 className="heading heading-secondary text-secondary pt-2">
                  Diagnosis
               </h4>
               <div className="form-group">
                  <select
                     value={mechanicToDetect}
                     name="mechanicToDetect"
                     className="form-input"
                     onChange={onChange}
                  >
                     <option value="">* Select Mechanic</option>
                     {usersAux.length > 0 &&
                        usersAux.map((user) => (
                           <option key={user._id} value={user._id}>
                              {`${user.name} ${user.lastname}`}
                           </option>
                        ))}
                  </select>
                  <label
                     htmlFor="mechanicToDetect"
                     className={`form-label ${
                        mechanicToDetect === "" ? "lbl" : ""
                     }`}
                  >
                     Mechanic
                  </label>
               </div>
               <div className="form-group">
                  <div className="two-in-row">
                     <input
                        className="form-input"
                        type="number"
                        value={timeToDetect}
                        name="timeToDetect"
                        placeholder="Hours to Diagnose"
                        onChange={onChange}
                     />
                     <input
                        className="form-input"
                        type="number"
                        value={paymentToDetect}
                        name="paymentToDetect"
                        placeholder="Cost"
                        onChange={onChange}
                     />
                  </div>
                  <div className="two-in-row">
                     <label
                        className={`form-label ${
                           timeToDetect === "" ? "lbl" : ""
                        }`}
                     >
                        Hours to Diagnose
                     </label>
                     <label
                        className={`form-label ${
                           paymentToDetect === "" ? "lbl" : ""
                        }`}
                     >
                        Cost
                     </label>
                  </div>
               </div>
               <h4 className="heading heading-secondary text-secondary pt-2">
                  Repair
               </h4>
               <div className="form-group">
                  <select
                     value={mechanicToFix}
                     name="mechanicToFix"
                     className="form-input"
                     onChange={onChange}
                  >
                     <option value="">* Select Mechanic</option>
                     {usersAux.length > 0 &&
                        usersAux.map((user) => (
                           <option key={user._id} value={user._id}>
                              {`${user.name} ${user.lastname}`}
                           </option>
                        ))}
                  </select>
                  <label
                     className={`form-label ${
                        mechanicToFix === "" ? "lbl" : ""
                     }`}
                  >
                     Mechanic
                  </label>
               </div>
               <div className="form-group">
                  <div className="two-in-row">
                     <input
                        className="form-input"
                        type="number"
                        value={timeToFix}
                        name="timeToFix"
                        placeholder="Hours to Repair"
                        onChange={onChange}
                     />
                     <input
                        className="form-input"
                        type="number"
                        value={paymentToFix}
                        name="paymentToFix"
                        placeholder="Cost"
                        onChange={onChange}
                     />
                  </div>
                  <div className="two-in-row">
                     <label
                        className={`form-label ${
                           timeToFix === "" ? "lbl" : ""
                        }`}
                     >
                        Hours to Repair
                     </label>
                     <label
                        className={`form-label ${
                           paymentToFix === "" ? "lbl" : ""
                        }`}
                     >
                        Cost
                     </label>
                  </div>
               </div>
               <div className="form-group">
                  <textarea
                     placeholder="Maintenance"
                     className="form-input"
                     value={maintenance}
                     name="maintenance"
                     onChange={onChange}
                     rows="3"
                  ></textarea>
                  <label
                     className={`form-label ${maintenance === "" ? "lbl" : ""}`}
                  >
                     Maintenance
                  </label>
               </div>
               <div className="form-group checkbox-group">
                  <input
                     className="form-input-checkbox"
                     type="checkbox"
                     onChange={onChange}
                     checked={tempFix}
                     id="tempFix"
                     name="tempFix"
                  />
                  <label className="form-lbl-checkbox" htmlFor="tempFix">
                     Temporal Repair
                  </label>
                  <input
                     className="form-input-checkbox"
                     type="checkbox"
                     onChange={onChange}
                     checked={permFix}
                     id="permFix"
                     name="permFix"
                  />
                  <label className="form-lbl-checkbox" htmlFor="permFix">
                     Permanent Repair
                  </label>
               </div>
               <div className="btn-center pt-4">
                  <button type="submit" className="btn btn-primary">
                     <BiSave className="icon" /> Save
                  </button>
                  {_id && (
                     <button
                        type="button"
                        onClick={() =>
                           setAdminValues((prev) => ({
                              ...prev,
                              modalClose: !modalClose,
                           }))
                        }
                        className="btn btn-secondary"
                     >
                        {maintenanceItem.closeDate ? (
                           <>
                              <AiFillUnlock className="icon" /> Reopen
                           </>
                        ) : (
                           <>
                              <AiFillLock className="icon" /> Close
                           </>
                        )}
                     </button>
                  )}
               </div>
            </form>
         </>
      )
   );
};

EditVessel.propTypes = {
   vessels: PropTypes.object.isRequired,
   maintenances: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   loadVessels: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   loadMaintenance: PropTypes.func.isRequired,
   registerUpdateMaintenance: PropTypes.func.isRequired,
   removeMaintenanceError: PropTypes.func.isRequired,
   getNewJobNumber: PropTypes.func.isRequired,
   closeReopenMaintenance: PropTypes.func.isRequired,
   updateLoadingSpinner: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
   users: state.users,
   maintenances: state.maintenances,
});

export default connect(mapStateToProps, {
   loadVessels,
   loadUsers,
   loadMaintenance,
   registerUpdateMaintenance,
   removeMaintenanceError,
   getNewJobNumber,
   closeReopenMaintenance,
   updateLoadingSpinner,
})(EditVessel);
