import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";
import { MdSearch } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

import {
   loadReservations,
   cancelDeleteReservation,
   clearReservation,
} from "../../../actions/reservation";
import { loadUsers } from "../../../actions/user";
import { loadVessels } from "../../../actions/vessel";

import PopUp from "../../modal/PopUp";
import Alert from "../../shared/Alert";

const ReservationList = ({
   reservations: { reservations, loading, error },
   users: { users },
   vessels: { vessels },
   loadReservations,
   cancelDeleteReservation,
   clearReservation,
   loadUsers,
   loadVessels,
}) => {
   const [formData, setFormData] = useState({
      dateFrom: "",
      dateTo: "",
      vessel: "",
      captain: "",
      active: true,
   });

   const [adminValues, setAdminValues] = useState({
      toggleDeleteConf: false,
      toDelete: "",
      amount: 0,
   });

   const { dateFrom, dateTo, vessel, captain, active } = formData;

   const { toggleDeleteConf, toDelete, amount } = adminValues;

   useEffect(() => {
      //*{Change} Cambiar a un mes
      const dateTo = moment().add(3, "M").format("YYYY-MM-DD");
      if (loading) {
         loadReservations({ active: true, dateTo });
         loadUsers({ active: true, type: "captain" });
         loadVessels({});
      }
   }, [loading, loadReservations, loadUsers, loadVessels]);

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
      loadReservations(formData);
   };

   return (
      <div className="reservations-list">
         <PopUp
            type="confirmation"
            confirm={() => cancelDeleteReservation(toDelete)}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleDeleteConf: !toggleDeleteConf,
               }))
            }
            toggleModal={toggleDeleteConf}
            text="Are you sure you want to cancel the reservation?"
            subtext={
               amount !== 0
                  ? `The customer has to pay $${amount.toFixed(2)} anyways.`
                  : undefined
            }
         />
         <h2 className="heading heading-primary text-primary">Reservations</h2>

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
                     id="captain"
                     className="form-input"
                     onChange={onChange}
                     value={captain}
                  >
                     <option value="">* Select Captain</option>
                     {users.length > 0 &&
                        users.map((user) => (
                           <option key={user._id} value={user._id}>
                              {user.name + " " + user.lastname}
                           </option>
                        ))}
                  </select>
                  <select
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
               </div>
               <div className="two-in-row">
                  <label
                     className={`form-label ${captain === "" ? "lbl" : ""}`}
                  >
                     Captain
                  </label>
                  <label className={`form-label ${vessel === "" ? "lbl" : ""}`}>
                     Vessel
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
               {reservations.length > 0 ? (
                  <div className="wrapper">
                     <table className="stick icon-6">
                        <thead>
                           <tr>
                              <th>Boat</th>
                              <th>Date</th>
                              <th>From</th>
                              <th>To</th>
                              <th>Captain</th>
                              <th></th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody>
                           {reservations.map((reservation) => (
                              <tr key={reservation._id}>
                                 <td>{reservation.vessel.name}</td>
                                 <td>
                                    <Moment
                                       date={reservation.dateFrom}
                                       utc
                                       format="MM/DD/YY"
                                    />
                                 </td>
                                 <td>
                                    <Moment
                                       date={reservation.dateFrom}
                                       utc
                                       format="h a"
                                    />
                                 </td>
                                 <td>
                                    <Moment
                                       date={reservation.dateTo}
                                       format={
                                          moment(reservation.dateFrom)
                                             .utc()
                                             .format("MM/DD/YY") !==
                                          moment(reservation.dateTo)
                                             .utc()
                                             .format("MM/DD/YY")
                                             ? "MM/DD/YY - h a"
                                             : "h a"
                                       }
                                       utc
                                    />
                                 </td>
                                 <td>
                                    {reservation.crew.captain.name +
                                       " " +
                                       reservation.crew.captain.lastname}
                                 </td>
                                 <td>
                                    <Link
                                       className="btn-text secondary"
                                       to={`/admin-reservation/${reservation._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearReservation();
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
                                             toDelete: reservation._id,
                                             amount:
                                                reservation.downpayment.type ===
                                                "stripe"
                                                   ? Math.round(
                                                        (reservation.downpayment
                                                           .amount *
                                                           0.029 +
                                                           0.3 +
                                                           Number.EPSILON) *
                                                           100
                                                     ) / 100
                                                   : 0,
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
                  <Link to="/new-reservation" className="btn btn-primary">
                     <BiPlus className="icon" /> Reservation
                  </Link>
               </div>
            </>
         )}
      </div>
   );
};

ReservationList.propTypes = {
   reservations: PropTypes.object.isRequired,
   loadReservations: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   loadVessels: PropTypes.func.isRequired,
   clearReservation: PropTypes.func.isRequired,
   cancelDeleteReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   users: state.users,
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   loadReservations,
   cancelDeleteReservation,
   clearReservation,
   loadVessels,
   loadUsers,
})(ReservationList);
