import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import PopUp from "../../modal/PopUp";
import ReservationInfo from "../../shared/ReservationInfo";
import Payment from "../../shared/Payment";
import Schedule from "../../shared/Schedule";
import Alert from "../../shared/Alert";

import {
   loadReservation,
   updateReservation,
} from "../../../actions/reservation";

const ChangeReservations = ({
   reservations: { reservation, loadingReservation },
   match,
   loadReservation,
   updateReservation,
   location,
}) => {
   const _id = match.params.reservation_id;
   const payment = location.pathname.substring(1, 8) === "payment";

   const [adminValues, setAdminValues] = useState({
      toggleModal: false,
   });

   const [formData, setFormData] = useState({});

   const { toggleModal } = adminValues;

   useEffect(() => {
      if (loadingReservation) {
         loadReservation(_id);
      }
   }, [loadReservation, loadingReservation, _id]);

   const saveData = (formData) => {
      setFormData(formData);
      setAdminValues((prev) => ({
         ...prev,
         toggleModal: !toggleModal,
      }));
   };

   return (
      !loadingReservation && (
         <div className="reserve-update">
            <PopUp
               toggleModal={toggleModal}
               setToggleModal={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     toggleModal: !toggleModal,
                  }))
               }
               confirm={() => updateReservation(formData, _id)}
               text="Are you sure you want to modify the reservation?"
            />
            <h2 className="heading heading-primary">
               Reservation {payment ? "Payment" : "Update"}
            </h2>
            <ReservationInfo reservation={reservation} type="update" />
            {payment ? (
               <div className="row pt-2">
                  <div className="row-item">
                     <h2 className="heading-tertiary text-primary">
                        Charge Description
                     </h2>
                     <table className="info">
                        <tbody>
                           <tr>
                              <td>Charter Price:</td>
                              <td>${reservation.payment.charterValue}</td>
                           </tr>
                           <tr>
                              <td>Service Fee:</td>
                              <td>${reservation.payment.serviceFee}</td>
                           </tr>
                           <tr>
                              <td>Taxes:</td>
                              <td>${reservation.payment.taxes}</td>
                           </tr>
                           <tr>
                              <td>Total:</td>
                              <td>${reservation.payment.total}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                  <div className="row-item" style={{ alignSelf: "self-start" }}>
                     <h2 className="heading-tertiary text-primary">
                        Downpayment
                     </h2>
                     <Alert type="3" />
                     <table className="info">
                        <tbody>
                           <tr>
                              <td>
                                 {reservation.payment.downpayment.payStripe
                                    ? "Paid Amount:"
                                    : "Amount to Pay:"}
                              </td>
                              <td>${reservation.payment.downpayment.amount}</td>
                           </tr>
                           {reservation.payment.downpayment.payStripe && (
                              <tr>
                                 <td>Pending Amount:</td>
                                 <td>
                                    $
                                    {Math.round(
                                       (reservation.payment.total -
                                          reservation.payment.downpayment
                                             .amount +
                                          Number.EPSILON) *
                                          100
                                    ) / 100}
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                     {!reservation.payment.downpayment.payStripe && (
                        <div className="btn-center">
                           <Payment />
                        </div>
                     )}
                  </div>
               </div>
            ) : (
               <Schedule
                  vessel={reservation.vessel}
                  type="update"
                  reservation={reservation}
                  saveData={saveData}
               />
            )}
         </div>
      )
   );
};

ChangeReservations.propTypes = {
   reservations: PropTypes.object.isRequired,
   days: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   loadReservation: PropTypes.func.isRequired,
   updateReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   days: state.days,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadReservation,
   updateReservation,
})(ChangeReservations);
