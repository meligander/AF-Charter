import React, { useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { MdAttachMoney } from "react-icons/md";
import PropTypes from "prop-types";

import { makeCashPayment, cancelPayment } from "../../../actions/payment";

import Payment from "../Payment";
import Alert from "../../shared/Alert";
import PopUp from "../../modal/PopUp";

const PaymentInfo = ({
   reservations: { reservation },
   auth: { loggedUser },
   makeCashPayment,
   cancelPayment,
}) => {
   const isAdmin =
      loggedUser.type === "admin" || loggedUser.type === "admin&captain";
   const pay = {
      ...reservation.payment,
      downpayment: {
         ...reservation.payment.downpayment,
         fee:
            Math.round(
               (reservation.payment.downpayment.amount * 0.029 +
                  0.3 +
                  Number.EPSILON) *
                  100
            ) / 100,
      },
      balance: {
         ...reservation.payment.balance,
         fee:
            Math.round(
               (reservation.payment.balance.amount * 0.029 +
                  0.3 +
                  Number.EPSILON) *
                  100
            ) / 100,
      },
   };

   const [formData, setFormData] = useState({
      downpaymentType: pay.downpayment.type ? pay.downpayment.type : "",
      balanceType: pay.balance.type ? pay.balance.type : "",
   });

   const [adminValues, setAdminValues] = useState({
      type: "",
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
               makeCashPayment(
                  {
                     amount: pay[type].amount,
                     type,
                  },
                  pay._id
               );
               if (pay[type].type === "stripe") cancelPayment(pay.id, type);
            }}
            setToggleModal={toggleModalConfirm}
            toggleModal={modalConfirm}
            text={`Are you sure you want to ${
               pay[type] && pay[type].status === "success" ? "change" : "make"
            } the ${type} payment?`}
            subtext={
               pay[type] && pay[type].status === "success"
                  ? "If you change the payment method, the previous one will be canceled"
                  : undefined
            }
         />
         <PopUp
            type="confirmation"
            confirm={() => cancelPayment(pay._id, type)}
            setToggleModal={toggleModalDelete}
            toggleModal={modalDelete}
            text="Are you sure you want to cancel the payment?"
            subtext={
               type && pay[type].type === "stripe"
                  ? `${isAdmin ? "The customer" : "You"} will pay $${
                       pay[type].fee
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
                     <td>${pay.charterValue}</td>
                  </tr>
                  <tr>
                     <td>Service Fee:</td>
                     <td>${pay.serviceFee}</td>
                  </tr>
                  <tr>
                     <td>Taxes:</td>
                     <td>${pay.taxes}</td>
                  </tr>
                  <tr>
                     <td>Total:</td>
                     <td>${pay.total}</td>
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
                           : pay.downpayment.status === "success"
                           ? "Paid Amount:"
                           : "Amount to Pay:"}
                     </td>
                     <td>${pay.downpayment.amount}</td>
                  </tr>
                  {isAdmin ? (
                     <>
                        <tr>
                           <td>Status:</td>
                           <td
                              className={
                                 pay.downpayment.status === "success"
                                    ? "text-success"
                                    : "text-danger"
                              }
                           >
                              {pay.downpayment.status
                                 ? pay.downpayment.status[0].toUpperCase() +
                                   pay.downpayment.status.substring(1)
                                 : "Not Paid"}
                           </td>
                        </tr>
                        {pay.downpayment.date && (
                           <tr>
                              <td>Date:</td>
                              <td>
                                 <Moment
                                    date={pay.downpayment.date}
                                    format="MM/DD/YY  -  h:m a"
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
                        {pay.downpayment.type === "stripe" && (
                           <tr>
                              <td>Id:</td>
                              <td>{pay.downpayment.id}</td>
                           </tr>
                        )}
                     </>
                  ) : (
                     pay.downpayment.status === "success" && (
                        <tr>
                           <td>Pending Amount:</td>
                           <td>${pay.balance.amount}</td>
                        </tr>
                     )
                  )}
               </tbody>
            </table>

            <div className="btn-center">
               {loggedUser.type === "customer" ? (
                  <>
                     {!pay.downpayment.status ||
                     pay.downpayment.status !== "success" ? (
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
                     {((downpaymentType !== pay.downpayment.type &&
                        downpaymentType !== "") ||
                        pay.downpayment.status === "canceled") && (
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
                                 Pay <MdAttachMoney className="icon" />
                              </button>
                           )}
                        </>
                     )}
                     {pay.downpayment.status === "success" &&
                        pay.downpayment.type === downpaymentType && (
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
                           <td>${pay.balance.amount}</td>
                        </tr>
                        <tr>
                           <td>Status:</td>
                           <td
                              className={
                                 pay.balance.status === "success"
                                    ? "text-success"
                                    : "text-danger"
                              }
                           >
                              {pay.balance.status
                                 ? pay.balance.status[0].toUpperCase() +
                                   pay.balance.status.substring(1)
                                 : "Not Paid"}
                           </td>
                        </tr>
                        {pay.balance.status && (
                           <tr>
                              <td>Date:</td>
                              <td>
                                 <Moment
                                    date={pay.downpayment.date}
                                    format="MM/DD/YY  -  h:m a"
                                 />
                              </td>
                           </tr>
                        )}
                        {pay.downpayment.status === "success" && (
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
                        balanceType !== pay.balance.type) ||
                        pay.balance.status === "canceled") && (
                        <>
                           {balanceType === "stripe" ? (
                              <Payment type="balance" />
                           ) : (
                              <button
                                 onClick={() => toggleModalConfirm("balance")}
                                 className="btn btn-success"
                              >
                                 Pay <MdAttachMoney className="icon" />
                              </button>
                           )}
                        </>
                     )}
                     {pay.balance.status === "success" &&
                        pay.balance.type === balanceType && (
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
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   auth: state.auth,
});

export default connect(mapStateToProps, { makeCashPayment, cancelPayment })(
   PaymentInfo
);
