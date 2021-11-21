import React, { useState } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { MdAttachMoney } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import PropTypes from "prop-types";

import PopUp from "../../modal/PopUp";

import "./style.scss";

const ReservationInfo = ({
   reservation,
   type,
   clearReservations,
   cancelDeleteReservation,
}) => {
   const dateFrom = new Date(reservation.dateFrom);
   const dateTo = new Date(reservation.dateTo);
   const diff = dateFrom.getDate() !== dateTo.getDate();

   const [adminValues, setAdminValues] = useState({
      toggleModal: false,
   });

   const { toggleModal } = adminValues;

   return (
      <div className="row reservation-info">
         <PopUp
            type="confirmation"
            confirm={() => cancelDeleteReservation(reservation)}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModal: !toggleModal,
               }))
            }
            toggleModal={toggleModal}
            text="Are you sure you want to cancel the reservation?"
            subtext={
               reservation.downpayment.fee
                  ? `You have to pay $${reservation.downpayment.fee.toFixed(
                       2
                    )} anyways.`
                  : undefined
            }
         />
         <div className="row-item vessel">
            <div
               className="reservation-info-img img"
               style={{
                  backgroundImage: `url( ${reservation.vessel.mainImg.filePath})`,
               }}
            ></div>
            <h4 className="heading-secondary text-secondary text-center my-2">
               {reservation.vessel.name}
            </h4>
         </div>
         <div className="row-item">
            <h4 className="heading-tertiary text-primary my-2">
               Reservation Info
            </h4>
            <table className="info">
               <tbody>
                  <tr>
                     <td>{`Date${diff ? "s" : ""}:`}</td>
                     <td>
                        <Moment
                           format="MM/DD/YY"
                           date={reservation.dateFrom}
                           utc
                        />
                        {diff
                           ? " - " +
                             (
                                <Moment
                                   format="MM/DD/YY"
                                   date={reservation.dateTo}
                                   utc
                                />
                             )
                           : ""}
                     </td>
                  </tr>
                  <tr>
                     <td>From:</td>
                     <td>
                        <Moment format="h a" date={reservation.dateFrom} utc />
                     </td>
                  </tr>
                  <tr>
                     <td>To:</td>
                     <td>
                        <Moment format="h a" date={reservation.dateTo} utc />
                     </td>
                  </tr>
                  <tr>
                     <td className="myreservations-info-title">Paid:</td>
                     <td>
                        {reservation.downpayment.status === "success"
                           ? "Yes"
                           : "No"}
                     </td>
                  </tr>
                  <tr>
                     <td>Captain:</td>
                     <td>
                        {reservation.crew &&
                           reservation.crew.captain &&
                           `${reservation.crew.captain.name} ${reservation.crew.captain.lastname}`}
                     </td>
                  </tr>
               </tbody>
            </table>

            {type === "list" && (
               <div className="btn-right">
                  <Link
                     onClick={() => {
                        clearReservations();
                        window.scroll(0, 0);
                     }}
                     to={`/payment/${reservation._id}`}
                     className="btn btn-success"
                  >
                     {/*  Pay&nbsp; */}
                     <MdAttachMoney className="icon" />
                  </Link>
                  <Link
                     onClick={() => {
                        clearReservations();
                        window.scroll(0, 0);
                     }}
                     to={`/reservation/${reservation._id}`}
                     className="btn btn-secondary"
                  >
                     {/*  Edit&nbsp; */}
                     <FiEdit className="icon" />
                  </Link>
                  <button
                     type="button"
                     onClick={() =>
                        setAdminValues((prev) => ({
                           ...prev,
                           toggleModal: !toggleModal,
                        }))
                     }
                     className="btn btn-danger"
                  >
                     {/* Cancel&nbsp; */}
                     <AiOutlineDelete className="icon" />
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

ReservationInfo.propTypes = {
   reservation: PropTypes.object.isRequired,
   type: PropTypes.string.isRequired,
   clearReservations: PropTypes.func,
   cancelDeleteReservation: PropTypes.func,
};

export default ReservationInfo;
