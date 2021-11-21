import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BiSave } from "react-icons/bi";

import { updateReservation } from "../../../../actions/reservation";

const CrewTab = ({
   auth: { loggedUser },
   reservations: { reservation },
   users: { users, usersAux },
   vessels: { vessels },
   updateReservation,
}) => {
   const [formData, setFormData] = useState({
      captain: reservation.crew.captain._id,
      mates: reservation.crew.mates ? reservation.crew.mates : [],
      vessel: reservation.vessel._id,
   });

   const { captain, mates, vessel } = formData;

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]:
            e.target.name !== "mates"
               ? e.target.value
               : e.target.checked
               ? [...prev.mates, e.target.value]
               : prev.mates.filter((item) => item !== e.target.value),
      }));
   };

   const onSubmit = (e) => {
      e.preventDefault();
      updateReservation(formData, reservation._id, loggedUser.type);
   };

   return (
      <form className="form" onSubmit={onSubmit}>
         <div className="form-group">
            <h3 className="heading heading-secondary">Vessel:</h3>
            <select
               name="vessel"
               className="form-input m-2"
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
         </div>
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
               {usersAux.length > 0 ? (
                  usersAux.map((user, i) => (
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
                        <label className="form-lbl-checkbox" htmlFor={`m${i}`}>
                           {`${user.name} ${user.lastname}`}
                        </label>
                     </React.Fragment>
                  ))
               ) : (
                  <p className="text-danger">No available mates</p>
               )}
            </div>
         </div>
         <div className="btn-center mt-4">
            <button type="submit" className="btn btn-primary">
               <BiSave className="icon" /> Update
            </button>
         </div>
      </form>
   );
};

CrewTab.propTypes = {
   users: PropTypes.object.isRequired,
   reservations: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   updateReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   users: state.users,
   reservations: state.reservations,
   vessels: state.vessels,
});

export default connect(mapStateToProps, { updateReservation })(CrewTab);
