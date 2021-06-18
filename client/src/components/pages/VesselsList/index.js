import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";
import { MdSearch } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

import {
   loadVessels,
   deleteVessel,
   clearVessel,
} from "../../../actions/vessel";

import PopUp from "../../modal/PopUp";
import Alert from "../../shared/Alert";

const VesselsList = ({
   vessels: { vessels, loading, error },
   loadVessels,
   deleteVessel,
   clearVessel,
}) => {
   const [formData, setFormData] = useState({
      name: "",
      brand: "",
      active: true,
   });

   const [adminValues, setAdminValues] = useState({
      toggleDeleteConf: false,
      toDelete: "",
   });

   const { name, brand, active } = formData;

   const { toggleDeleteConf, toDelete } = adminValues;

   useEffect(() => {
      if (loading) loadVessels({});
   }, [loading, loadVessels]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         ...(e.target.id === "active"
            ? { active: !active }
            : { [e.target.id]: e.target.value }),
      }));
   };

   const onSubmit = (e) => {
      e.preventDefault();
      loadVessels(formData);
   };

   return (
      <div className="vessels-list">
         <PopUp
            text="Are you sure you want to delete the vessel?"
            type="confirmation"
            confirm={() => deleteVessel(toDelete)}
            toggleModal={toggleDeleteConf}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleDeleteConf: !toggleDeleteConf,
               }))
            }
         />
         <h2 className="heading heading-primary text-primary">Vessels</h2>

         <Alert type="2" />
         <form className="form filter" onSubmit={onSubmit}>
            <p className="heading-tertiary text-secondary">Filter</p>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="text"
                     id="name"
                     placeholder="Name"
                     value={name}
                     onChange={onChange}
                  />
                  <input
                     className="form-input"
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
            <div className="btn-right">
               <button type="submit" className="btn btn-secondary">
                  <MdSearch className="icon" />
               </button>
            </div>
         </form>
         {!loading && (
            <>
               {vessels.length > 0 ? (
                  <div className="wrapper">
                     <table className="stick icon-5">
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Brand</th>
                              <th>Year</th>
                              <th>Active</th>
                              <th></th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody>
                           {vessels.map((vessel) => (
                              <tr key={vessel._id}>
                                 <td>{vessel.name}</td>
                                 <td>{vessel.brand}</td>
                                 <td>{vessel.year}</td>
                                 <td>{vessel.active ? "Yes" : "No"}</td>
                                 <td>
                                    <Link
                                       className="btn-text secondary"
                                       to={`/edit-vessel/${vessel._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearVessel();
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
                                             toDelete: vessel._id,
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
               <div className="btn-right">
                  <Link to="/new-vessel" className="btn btn-primary">
                     <BiPlus className="icon" /> Vessel
                  </Link>
               </div>
            </>
         )}
      </div>
   );
};

VesselsList.propTypes = {
   vessels: PropTypes.object.isRequired,
   loadVessels: PropTypes.func.isRequired,
   clearVessel: PropTypes.func.isRequired,
   deleteVessel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   loadVessels,
   deleteVessel,
   clearVessel,
})(VesselsList);
