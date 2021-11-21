import React, { useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { MdAttachMoney } from "react-icons/md";
import PropTypes from "prop-types";

import { makeCashPayment, cancelPayment } from "../../../actions/payment";
import { updateReservation } from "../../../actions/reservation";
import { formatNumber } from "../../../actions/mixvalues";

import Payment from "../Payment";
import Alert from "../../shared/Alert";
import PopUp from "../../modal/PopUp";

const PaymentInfo = ({
   reservations: { reservation },
   auth: { loggedUser },
   makeCashPayment,
   cancelPayment,
   updateReservation,
}) => {
   const isAdmin =
      loggedUser.type === "admin" || loggedUser.type === "admin&captain";

   const [formData, setFormData] = useState({
      downpaymentType: reservation.downpayment.type
         ? reservation.downpayment.type
         : "",
      balanceType: reservation.balance.type ? reservation.balance.type : "",
   });

   const [adminValues, setAdminValues] = useState({
      type: "downpayment",
      modalConfirm: false,
      modalDelete: false,
   });

   const { downpaymentType, balanceType } = formData;

   const { type, modalConfirm, modalDelete } = adminValues;

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const toggleModalConfirm = (type) => {
      setAdminValues((prev) => ({
         ...prev,
         ...(type && { type }),
         modalConfirm: !modalConfirm,
      }));
   };

   const toggleModalDelete = (type) => {
      setAdminValues((prev) => ({
         ...prev,
         ...(type && { type }),
         modalDelete: !modalDelete,
      }));
   };

   return (
      <div className="row pt-2">
         <PopUp
            type="confirmation"
            confirm={() => {
               makeCashPayment(reservation[type]._id);
               if (type === "balance")
                  updateReservation({ active: false }, reservation._id);
               if (reservation[type].type === "stripe")
                  cancelPayment(reservation[type]._id);
            }}
            setToggleModal={toggleModalConfirm}
            toggleModal={modalConfirm}
            text={`Are you sure you want to ${
               reservation[type] && reservation[type].status === "success"
                  ? "change"
                  : "make"
            } the ${type} payment${
               type === "balance" && reservation.balance.status !== "success"
                  ? " and complete the reservation"
                  : ""
            }?`}
            subtext={
               reservation[type].status === "success"
                  ? "If you change the payment method, the previous one will be canceled"
                  : undefined
            }
         />
         <PopUp
            type="confirmation"
            confirm={() => {
               cancelPayment(reservation[type]._id);
               if (type === "balance")
                  updateReservation({ active: true }, reservation._id);
            }}
            setToggleModal={toggleModalDelete}
            toggleModal={modalDelete}
            text="Are you sure you want to cancel the payment?"
            subtext={
               type && reservation[type].type === "stripe"
                  ? `${isAdmin ? "The customer" : "You"} will reservation $${
                       reservation[type].fee
                    } anyways.`
                  : undefined
            }
         />
         <div className="row-item" style={{ alignSelf: "self-start" }}>
            <h2 className="heading-tertiary text-primary">
               Payment Description
            </h2>
            <table className="info">
               <tbody>
                  <tr>
                     <td>Charter Price:</td>
                     <td>${reservation.charterValue}</td>
                  </tr>
                  <tr>
                     <td>Service Fee:</td>
                     <td>${reservation.serviceFee}</td>
                  </tr>
                  <tr>
                     <td>Taxes:</td>
                     <td>${reservation.taxes}</td>
                  </tr>
                  <tr>
                     <td>Total:</td>
                     <td>${reservation.total}</td>
                  </tr>
               </tbody>
            </table>
         </div>
         <div className="row-item" style={{ alignSelf: "self-start" }}>
            <Alert type="3" />
            <h2 className="heading-tertiary text-primary">Downpayment</h2>
            <table className="info">
               <tbody>
                  <tr>
                     <td>
                        {isAdmin
                           ? "Amount:"
                           : reservation.downpayment.status === "success"
                           ? "Paid Amount:"
                           : "Amount to pay:"}
                     </td>
                     <td>$ {formatNumber(reservation.downpayment.amount)}</td>
                  </tr>
                  {isAdmin ? (
                     <>
                        <tr>
                           <td>Status:</td>
                           <td
                              className={
                                 reservation.downpayment.status === "success"
                                    ? "text-success"
                                    : "text-danger"
                              }
                           >
                              {reservation.downpayment.status
                                 ? reservation.downpayment.status[0].toUpperCase() +
                                   reservation.downpayment.status.substring(1)
                                 : "Not Paid"}
                           </td>
                        </tr>
                        {reservation.downpayment.date && (
                           <tr>
                              <td>Date:</td>
                              <td>
                                 <Moment
                                    date={reservation.downpayment.date}
                                    format="MM/DD/YY  -  h:mm a"
                                 />
                              </td>
                           </tr>
                        )}

                        <tr>
                           <td>Type:</td>
                           <td>
                              <select
                                 name="downpaymentType"
                                 className="form-input"
                                 onChange={onChange}
                                 value={downpaymentType}
                              >
                                 <option value="">* Select Method</option>
                                 <option value="cash">Cash</option>
                                 <option value="stripe">Stripe</option>
                              </select>
                           </td>
                        </tr>
                        {reservation.downpayment.type === "stripe" && (
                           <tr>
                              <td>Id:</td>
                              <td>{reservation.downpayment.id}</td>
                           </tr>
                        )}
                     </>
                  ) : (
                     reservation.downpayment.status === "success" && (
                        <tr>
                           <td>Pending Amount:</td>
                           <td>$ {formatNumber(reservation.balance.amount)}</td>
                        </tr>
                     )
                  )}
               </tbody>
            </table>

            <div className="btn-center">
               {loggedUser.type === "customer" ? (
                  <>
                     {!reservation.downpayment.status ||
                     reservation.downpayment.status !== "success" ? (
                        <Payment type="downpayment" />
                     ) : (
                        <button
                           className="btn btn-danger"
                           onClick={() => toggleModalDelete("downpayment")}
                        >
                           Cancel
                        </button>
                     )}
                  </>
               ) : (
                  <>
                     {((downpaymentType !== reservation.downpayment.type &&
                        downpaymentType !== "") ||
                        reservation.downpayment.status === "canceled") && (
                        <>
                           {downpaymentType === "stripe" ? (
                              <Payment type="downpayment" />
                           ) : (
                              <button
                                 onClick={() =>
                                    toggleModalConfirm("downpayment")
                                 }
                                 className="btn btn-success"
                              >
                                 Pay
                                 <MdAttachMoney
                                    className="icon"
                                    style={{ marginBottom: "-0.65rem" }}
                                 />
                              </button>
                           )}
                        </>
                     )}
                     {reservation.downpayment.status === "success" &&
                        reservation.downpayment.type === downpaymentType && (
                           <button
                              className="btn btn-danger"
                              onClick={() => toggleModalDelete("downpayment")}
                           >
                              Cancel
                           </button>
                        )}
                  </>
               )}
            </div>
            {isAdmin && (
               <div className="mt-2">
                  <h2 className="heading-tertiary text-primary">Balance</h2>
                  <table className="info">
                     <tbody>
                        <tr>
                           <td>Amount:</td>
                           <td>$ {formatNumber(reservation.balance.amount)}</td>
                        </tr>
                        <tr>
                           <td>Status:</td>
                           <td
                              className={
                                 reservation.balance.status === "success"
                                    ? "text-success"
                                    : "text-danger"
                              }
                           >
                              {reservation.balance.status
                                 ? reservation.balance.status[0].toUpperCase() +
                                   reservation.balance.status.substring(1)
                                 : "Not Paid"}
                           </td>
                        </tr>
                        {reservation.balance.status && (
                           <tr>
                              <td>Date:</td>
                              <td>
                                 <Moment
                                    date={reservation.balance.date}
                                    format="MM/DD/YY  -  h:mm a"
                                 />
                              </td>
                           </tr>
                        )}
                        {reservation.downpayment.status === "success" && (
                           <tr>
                              <td>Type:</td>
                              <td>
                                 <select
                                    name="balanceType"
                                    className="form-input"
                                    onChange={onChange}
                                    value={balanceType}
                                 >
                                    <option value="">* Select Method"</option>
                                    <option value="cash">Cash</option>
                                    <option value="stripe">Stripe</option>
                                 </select>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>

                  <div className="btn-center">
                     {((balanceType !== "" &&
                        balanceType !== reservation.balance.type) ||
                        reservation.balance.status === "canceled") && (
                        <>
                           {balanceType === "stripe" ? (
                              <Payment type="balance" />
                           ) : (
                              <button
                                 onClick={() => toggleModalConfirm("balance")}
                                 className="btn btn-success"
                              >
                                 Pay
                                 <MdAttachMoney
                                    className="icon"
                                    style={{ marginBottom: "-0.65rem" }}
                                 />
                              </button>
                           )}
                        </>
                     )}
                     {reservation.balance.status === "success" &&
                        reservation.balance.type === balanceType && (
                           <button
                              className="btn btn-danger"
                              onClick={() => toggleModalDelete("balance")}
                           >
                              Cancel
                           </button>
                        )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

PaymentInfo.propTypes = {
   reservations: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   makeCashPayment: PropTypes.func.isRequired,
   cancelPayment: PropTypes.func.isRequired,
   updateReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   makeCashPayment,
   cancelPayment,
   updateReservation,
})(PaymentInfo);
