import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BiSave } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";

import { loadVessels } from "../../../actions/vessel";
import { loadUsers } from "../../../actions/user";
import { registerReservation } from "../../../actions/reservation";

import Alert from "../../shared/Alert";
import Schedule from "./Schedule";

//import "./style.scss";

const NewReservation = ({
   reservations: { error },
   users: { users, usersAux, loadingAux },
   vessels: { vessels },
   loadVessels,
   loadUsers,
   registerReservation,
}) => {
   const [formData, setFormData] = useState({
      vessel: "",
      captain: "",
      mates: [],
      dateTo: "",
      dateFrom: "",
      customer: "",
      charterValue: "",
   });

   const [adminValues, setAdminValues] = useState({
      email: "",
      results: [],
      allMates: [],
      searchDisplay: false,
   });

   const { vessel, captain, mates, customer, searchDisplay } = formData;

   const { email, results, allMates } = adminValues;

   useEffect(() => {
      if (loadingAux) {
         loadVessels({ active: true });
         loadUsers({ active: true, type: "mate" }, false);
      } else {
         if (usersAux.length > 0) {
            if (usersAux[0].type === "mate")
               setAdminValues((prev) => ({ ...prev, allMates: usersAux }));
            else setAdminValues((prev) => ({ ...prev, results: usersAux }));
         } else setAdminValues((prev) => ({ ...prev, results: [] }));
      }
   }, [loadVessels, loadUsers, usersAux, loadingAux]);

   const onChange = (e) => {
      if (e.target.name === "email") {
         setAdminValues((prev) => ({ ...prev, email: e.target.value }));
         if (e.target.value.length > 1) {
            loadUsers(
               {
                  active: true,
                  type: "customer",
                  email: e.target.value,
               },
               false,
               true
            );
         }
      } else {
         console.log({
            [e.target.name]:
               e.target.name !== "mates" ? e.target.value : e.target.checked,
         });
         setFormData((prev) => ({
            ...prev,
            [e.target.name]:
               e.target.name !== "mates"
                  ? e.target.value
                  : e.target.checked
                  ? [...prev.mates, e.target.value]
                  : prev.mates.filter((item) => item !== e.target.value),
         }));
      }
   };

   const onSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
      registerReservation(
         {
            ...formData,
            ...(customer !== "" && { customer: { _id: customer } }),
         },
         true
      );
   };

   const selectCustomer = (user) => {
      setAdminValues((prev) => ({
         ...prev,
         email: user.email,
         results: [],
      }));
      setFormData((prev) => ({
         ...prev,
         customer: user._id,
      }));
   };

   const cancelCustomer = () => {
      setAdminValues((prev) => ({
         ...prev,
         email: "",
      }));
      setFormData((prev) => ({
         ...prev,
         customer: "",
      }));
   };

   const updateDates = (dateFrom, dateTo, charterValue) => {
      setFormData((prev) => ({
         ...prev,
         dateFrom,
         dateTo,
         charterValue,
      }));
   };

   return (
      <div className="edit-vessel">
         <h2 className="heading heading-primary text-primary">
            New Reservation
         </h2>
         <Alert type="3" />
         <form className="form" onSubmit={onSubmit}>
            <div className="form-group form-search">
               <div className="form-search-display">
                  {email.length > 1 && customer === "" && (
                     <>
                        {results.length > 0 ? (
                           results.map((user) => (
                              <p
                                 className="form-search-item"
                                 onClick={() => selectCustomer(user)}
                                 key={user._id}
                              >
                                 {user.email}
                              </p>
                           ))
                        ) : (
                           <p className="bg-danger form-search-item">
                              No matching results
                           </p>
                        )}
                     </>
                  )}
               </div>
               <input
                  className={`form-input ${
                     error.constructor === Array &&
                     error.some((value) => value.param === "email")
                        ? "invalid"
                        : ""
                  }`}
                  type="text"
                  value={email}
                  disabled={customer !== ""}
                  name="email"
                  id="email"
                  autoComplete="off"
                  onChange={onChange}
                  placeholder="Customer's Email"
               />
               <label
                  htmlFor="email"
                  className={`form-label ${email === "" ? "lbl" : ""}`}
               >
                  Customer's Email
               </label>

               {customer !== "" && (
                  <button
                     type="button"
                     onClick={cancelCustomer}
                     className="form-search-close"
                  >
                     <AiOutlineClose />
                  </button>
               )}
            </div>
            <div className="form-group">
               <select
                  name="vessel"
                  id="vessel"
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
               <label
                  htmlFor="vessel"
                  className={`form-label ${vessel === "" ? "lbl" : ""}`}
               >
                  Vessel
               </label>
            </div>

            {vessel !== "" && (
               <Schedule
                  vessel={vessels.filter((item) => item._id === vessel)[0]}
                  updateDates={updateDates}
               />
            )}

            <div className="form-group">
               <h3 className="heading heading-secondary">Captain:</h3>
               <div className="radio-group" id="radio-group">
                  {users.length > 0 ? (
                     users.map((user, i) => (
                        <React.Fragment key={user._id}>
                           <input
                              className="form-input-radio"
                              type="radio"
                              value={user._id}
                              onChange={onChange}
                              checked={captain === user._id}
                              name="captain"
                              id={`rb${i}`}
                           />
                           <label className="form-lbl-radio" htmlFor={`rb${i}`}>
                              {`${user.name} ${user.lastname}`}
                           </label>
                        </React.Fragment>
                     ))
                  ) : (
                     <p className="text-danger">No available captains</p>
                  )}
               </div>
            </div>
            <div className="form-group">
               <h3 className="heading heading-secondary">Mates:</h3>
               <div className="checkbox-group" id="radio-group">
                  {allMates.length > 0 ? (
                     allMates.map((user, i) => (
                        <React.Fragment key={user._id}>
                           <input
                              className="form-input-checkbox"
                              type="checkbox"
                              onChange={onChange}
                              checked={mates.some((item) => item === user._id)}
                              name="mates"
                              value={user._id}
                              id={`m${i}`}
                           />
                           <label
                              className="form-lbl-checkbox"
                              htmlFor={`m${i}`}
                           >
                              {`${user.name} ${user.lastname}`}
                           </label>
                        </React.Fragment>
                     ))
                  ) : (
                     <p className="text-danger">No available mates</p>
                  )}
               </div>
            </div>

            <div className="btn-center">
               <button type="submit" className="btn btn-primary">
                  <BiSave className="icon" /> Save
               </button>
            </div>
         </form>
      </div>
   );
};

NewReservation.propTypes = {
   reservations: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   loadVessels: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   registerReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
   users: state.users,
   reservations: state.reservations,
});

export default connect(mapStateToProps, {
   loadVessels,
   loadUsers,
   registerReservation,
})(NewReservation);
