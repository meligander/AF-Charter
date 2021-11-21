import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";
import { MdSearch } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

import { loadVessels } from "../../../actions/vessel";
import {
   loadMaintenances,
   deleteMaintenance,
   clearMaintenance,
} from "../../../actions/maintenance";
import { clearUsers } from "../../../actions/user";

import PopUp from "../../modal/PopUp";
import Alert from "../../shared/Alert";

const MaintenanceList = ({
   vessels: { vessels, loading: loadingVessels },
   maintenances: { maintenances, loading, error },
   loadVessels,
   loadMaintenances,
   deleteMaintenance,
   clearMaintenance,
   clearUsers,
}) => {
   const [formData, setFormData] = useState({
      dateFrom: "",
      dateTo: "",
      vessel: "",
      jobNumber: "",
      type: "",
      system: "",
      closed: false,
   });

   const [adminValues, setAdminValues] = useState({
      toggleDeleteConf: false,
      toDelete: "",
   });

   const { dateFrom, dateTo, vessel, jobNumber, type, system, closed } =
      formData;

   const { toggleDeleteConf, toDelete } = adminValues;

   useEffect(() => {
      if (loadingVessels) loadVessels({ active: true });
   }, [loadingVessels, loadVessels]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         ...(e.target.name === "closed"
            ? { closed: e.target.checked }
            : { [e.target.name]: e.target.value }),
      }));
   };

   const onSubmit = (e) => {
      e.preventDefault();
      loadMaintenances(formData);
   };

   return (
      <>
         <PopUp
            type="confirmation"
            confirm={() => deleteMaintenance(toDelete)}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleDeleteConf: !toggleDeleteConf,
               }))
            }
            toggleModal={toggleDeleteConf}
            text="Are you sure you want to delete the maintenace?"
         />
         <h2 className="heading heading-primary text-primary">Maintenances</h2>

         <Alert type="2" />
         <form className="form filter" onSubmit={onSubmit}>
            <p className="heading-tertiary text-secondary">Filter</p>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="date"
                     id="dateFrom"
                     value={dateFrom}
                     onChange={onChange}
                  />
                  <input
                     className="form-input"
                     type="date"
                     id="dateTo"
                     min={dateFrom !== "" ? dateFrom : ""}
                     value={dateTo}
                     onChange={onChange}
                  />
               </div>
               <div className="two-in-row">
                  <label className="form-label">From</label>
                  <label className="form-label">To</label>
               </div>
            </div>
            <div className="form-group">
               <div className="two-in-row">
                  <select
                     name="vessel"
                     className="form-input"
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
                  <input
                     className="form-input"
                     type="number"
                     name="jobNumber"
                     placeholder="Job Number"
                     value={jobNumber}
                     onChange={onChange}
                  />
               </div>
               <div className="two-in-row">
                  <label className={`form-label ${vessel === "" ? "lbl" : ""}`}>
                     Vessel
                  </label>
                  <label
                     className={`form-label ${jobNumber === "" ? "lbl" : ""}`}
                  >
                     Job Number
                  </label>
               </div>
            </div>
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
                  <label className={`form-label ${system === "" ? "lbl" : ""}`}>
                     System
                  </label>
                  <label className={`form-label ${type === "" ? "lbl" : ""}`}>
                     Type
                  </label>
               </div>
            </div>
            <div className="form-group checkbox-group">
               <input
                  className="form-input-checkbox"
                  type="checkbox"
                  onChange={onChange}
                  checked={closed}
                  id="closed"
                  name="closed"
               />
               <label className="form-lbl-checkbox" htmlFor="closed">
                  Closed
               </label>
            </div>
            <div className="btn-right">
               <button type="submit" className="btn btn-secondary">
                  <MdSearch className="icon" />
               </button>
            </div>
         </form>
         {!loading && (
            <>
               {maintenances.length > 0 ? (
                  <div className="wrapper">
                     <table className="stick icon-7">
                        <thead>
                           <tr>
                              <th>Vessel</th>
                              <th>Job #</th>
                              <th>Date</th>
                              <th>System</th>
                              <th>Type</th>
                              <th>Closed</th>
                              <th></th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody>
                           {maintenances.map((item) => (
                              <tr key={item._id}>
                                 <td>{item.vessel.name}</td>
                                 <td>{item.jobNumber}</td>
                                 <td>
                                    <Moment
                                       date={item.openDate}
                                       format="MM/DD/YY"
                                    />
                                 </td>
                                 <td>{item.system && item.system}</td>
                                 <td>{item.type && item.type}</td>
                                 <td>
                                    {item.closeDate ? (
                                       <Moment
                                          date={item.closeDate}
                                          format="MM/DD/YY"
                                       />
                                    ) : (
                                       "No"
                                    )}
                                 </td>
                                 <td>
                                    <Link
                                       className="btn-text secondary"
                                       to={`/edit-maintenance/${item._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearMaintenance();
                                          clearUsers();
                                       }}
                                    >
                                       <FiEdit />
                                    </Link>
                                 </td>
                                 <td>
                                    <button
                                       type="button"
                                       className="btn-text danger"
                                       onClick={() =>
                                          setAdminValues((prev) => ({
                                             ...prev,
                                             toggleDeleteConf:
                                                !toggleDeleteConf,
                                             toDelete: item._id,
                                          }))
                                       }
                                    >
                                       <AiOutlineDelete />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <h3 className="heading-secondary text-danger text-center py-5">
                     {error.msg}
                  </h3>
               )}
            </>
         )}
         <div className="btn-right">
            <Link
               to="/new-maintenance"
               onClick={() => {
                  clearMaintenance();
                  clearUsers();
                  window.scroll(0, 0);
               }}
               className="btn btn-primary"
            >
               <BiPlus className="icon" /> Maintenance
            </Link>
         </div>
      </>
   );
};

MaintenanceList.propTypes = {
   maintenances: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   loadMaintenances: PropTypes.func.isRequired,
   deleteMaintenance: PropTypes.func.isRequired,
   clearMaintenance: PropTypes.func.isRequired,
   loadVessels: PropTypes.func.isRequired,
   clearUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   maintenances: state.maintenances,
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   loadMaintenances,
   deleteMaintenance,
   clearMaintenance,
   loadVessels,
   clearUsers,
})(MaintenanceList);
