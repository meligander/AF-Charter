import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import moment from "moment";
import Calendar from "react-calendar";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   checkDayAvailability,
   checkMonthAvailability,
} from "../../../actions/day";
import {
   updateReservation,
   registerReservation,
} from "../../../actions/reservation";
import { checkAvailableCaptains } from "../../../actions/user";

import Alert from "../../shared/Alert";
import PopUp from "../../modal/PopUp";

const Schedule = ({
   auth: { loggedUser },
   vessels: { vessel: vesselInfo },
   reservations: { reservation },
   days: { day, availableHours, loadingAvailableHours, disabledDays },
   users: { users, loading },
   checkMonthAvailability,
   checkDayAvailability,
   checkAvailableCaptains,
   updateReservation,
   registerReservation,
}) => {
   const today = new Date();
   today.setDate(today.getDate() + 1);
   today.setHours(0, 0, 0);

   const type = reservation ? "update" : "reserve";

   let hoursDiff = 0;
   let originalDateFrom;
   let originalDateTo;

   if (reservation) {
      originalDateFrom = moment(reservation.dateFrom).utc();
      originalDateTo = moment(reservation.dateTo).utc();

      const milliseconds = Math.abs(originalDateFrom - originalDateTo);
      hoursDiff = milliseconds / 36e5;

      originalDateFrom = originalDateFrom.format("YYYY-MM-DD[T]HH:mm:SS[Z]");
      originalDateTo = originalDateTo.format("YYYY-MM-DD[T]HH:mm:SS[Z]");
   }

   const [adminValues, setAdminValues] = useState({
      date: new Date(),
      tab: 0,
      possiblesDateTo: [],
      vessel: reservation ? reservation.vessel : vesselInfo,
      toggleModal: false,
   });

   const [formData, setFormData] = useState({
      dateFrom: "",
      dateTo: "",
      captain:
         reservation && reservation.crew && reservation.crew.captain
            ? reservation.crew.captain
            : "",
      charterValue: 0,
   });

   const { dateTo, dateFrom, captain, charterValue } = formData;

   const { date, tab, possiblesDateTo, vessel, toggleModal } = adminValues;

   useEffect(() => {
      const today = new Date();

      checkMonthAvailability(
         vessel._id,
         today.getMonth(),
         today.getFullYear(),
         hoursDiff !== 0 && hoursDiff,
         originalDateFrom !== undefined && originalDateFrom
      );
   }, [checkMonthAvailability, vessel, hoursDiff, originalDateFrom]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         captain: e.target.value,
      }));
   };

   const onChangeDate = (changedDate) => {
      setAdminValues((prev) => ({
         ...prev,
         date: changedDate,
         tab: 1,
      }));
      checkDayAvailability(
         vessel._id,
         moment(changedDate).format("YYYY-MM-DD[T00:00:00Z]"),
         hoursDiff,
         reservation ? originalDateFrom : null,
         reservation ? originalDateTo : null
      );
   };

   const selectDateFrom = (time) => {
      const newDate = new Date(date);
      newDate.setHours(time);

      let possiblesDateTo = [];
      let newToDate;

      if (type === "update") {
         newToDate = new Date(newDate);
         newToDate.setHours(newDate.getHours() + hoursDiff);

         checkAvailableCaptains(
            moment(newDate).format("YYYY-MM-DD[T]HH:mm:SS[Z]"),
            moment(newToDate).format("YYYY-MM-DD[T]HH:mm:SS[Z]"),
            reservation && reservation._id
         );
      } else {
         for (let x = 0; x < vessel.prices.length; x++) {
            const newTime = time + vessel.prices[x].time;
            for (let y = 0; y < day.availableHours.length; y++) {
               if (
                  newTime > day.availableHours[y][0] &&
                  ((newTime <= day.availableHours[y][1] &&
                     day.availableHours[y][1] - day.availableHours[y][0] >=
                        vessel.prices[x].time) ||
                     day.availableHours[y][1] === 18)
               ) {
                  possiblesDateTo.push(x);
               }
            }
         }
      }

      setFormData((prev) => ({
         ...prev,
         dateFrom: newDate,
         ...(type === "update" && { dateTo: newToDate }),
      }));

      setAdminValues((prev) => ({
         ...prev,
         tab: type === "update" ? 3 : 2,
         ...(type === "reserve" && { possiblesDateTo }),
      }));
   };

   const selectDateTo = (item) => {
      const newDate = new Date(date);
      newDate.setHours(dateFrom.getHours() + vessel.prices[item].time);

      checkAvailableCaptains(
         moment(dateFrom).format("YYYY-MM-DD[T]HH:mm:SS[Z]"),
         moment(newDate).format("YYYY-MM-DD[T]HH:mm:SS[Z]"),
         reservation && reservation._id
      );

      setFormData((prev) => ({
         ...prev,
         dateTo: newDate,
         charterValue: vessel.prices[item].price,
      }));

      setAdminValues((prev) => ({
         ...prev,
         tab: 3,
      }));
   };

   const getToTime = (item) => {
      const time = dateFrom.getHours() + vessel.prices[item].time;
      if (time > 24) return time - 24 + " am";
      return `${time % 12 !== 0 ? time % 12 : 12} ${
         time >= 12 && time !== 24 ? "pm" : "am"
      }`;
   };

   const tileDisabled = ({ date, view }) => {
      if (view === "month" && disabledDays.length > 0) {
         // Check if a date React-Calendar wants to check is on the list of disabled dates
         return disabledDays.find((dDate) => isSameDay(dDate, date));
      }
   };

   const isSameDay = (date1, date2) => {
      if (
         moment(date1.substring(0, date1.length - 2)).format("MM-DD-YYYY") ===
         moment(date2).format("MM-DD-YYYY")
      )
         return true;
      return false;
   };

   const tabOpen = () => {
      switch (tab) {
         case 0:
            return (
               <>
                  <h5 className="heading heading-secondary text-secondary">
                     Pick up a Date
                  </h5>
               </>
            );
         case 1:
            return (
               !loadingAvailableHours && (
                  <>
                     {availableHours.length > 0 ? (
                        <>
                           <p className="heading-tertiary text-dark">From:</p>
                           {availableHours.map((hour, i) => (
                              <div
                                 className="schedule-item"
                                 key={i}
                                 onClick={() => selectDateFrom(hour)}
                              >
                                 {`${hour % 12 !== 0 ? hour % 12 : 12} ${
                                    hour >= 12 ? "pm" : "am"
                                 }`}
                              </div>
                           ))}
                        </>
                     ) : (
                        <h2 className="text-danger">
                           No availability on this day
                        </h2>
                     )}
                  </>
               )
            );
         case 2:
            return (
               <>
                  <p className="heading-tertiary text-dark">To:</p>
                  {possiblesDateTo.length > 0 &&
                     possiblesDateTo.map((item, i) => (
                        <div
                           className="schedule-item"
                           key={i}
                           onClick={() => selectDateTo(item)}
                        >
                           {getToTime(item)} - ${vessel.prices[item].price}
                        </div>
                     ))}
               </>
            );
         case 3:
            const diff = dateFrom.getDate() !== dateTo.getDate();
            return (
               <>
                  <p className="heading-tertiary text-dark">New Info:</p>
                  <form
                     className="form"
                     onSubmit={(e) => {
                        e.preventDefault();

                        if (type === "update") {
                           setAdminValues((prev) => ({
                              ...prev,
                              toggleModal: !toggleModal,
                           }));
                        } else {
                           registerReservation({
                              ...formData,
                              customer: loggedUser,
                              vessel: vessel._id,
                              dateFrom: moment(dateFrom).format(
                                 "YYYY-MM-DD[T]HH:mm:SS[Z]"
                              ),
                              dateTo: moment(dateTo).format(
                                 "YYYY-MM-DD[T]HH:mm:SS[Z]"
                              ),
                           });
                        }
                     }}
                  >
                     <Alert type="3" />
                     <p className="schedule-info">
                        <span className="text-primary">{`Date${
                           diff ? "s" : ""
                        }:`}</span>{" "}
                        &nbsp;
                        <Moment date={dateFrom} format="MM/DD/YY" />
                        {`${
                           diff
                              ? "- " +
                                <Moment date={dateTo} format="MM/DD/YY" />
                              : ""
                        }`}
                     </p>
                     <p className="schedule-info">
                        <span className="text-primary">Time:</span> &nbsp;
                        <Moment format="h a" date={dateFrom} /> -{" "}
                        <Moment format="h a" date={dateTo} />
                     </p>
                     {type === "reserve" && (
                        <p className="schedule-info">
                           <span className="text-primary">Price:</span> $
                           {charterValue}
                        </p>
                     )}
                     {loggedUser.type === "customer" && (
                        <>
                           <p className="schedule-info">
                              <span className="text-primary">Captain:</span>
                           </p>
                           <div className="radio-group" id="radio-group">
                              {!loading && users.length > 0 ? (
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
                                       <label
                                          className="form-lbl-radio"
                                          htmlFor={`rb${i}`}
                                       >
                                          {`${user.name} ${user.lastname}`}
                                       </label>
                                    </React.Fragment>
                                 ))
                              ) : (
                                 <p className="text-danger">
                                    No available captains
                                 </p>
                              )}
                           </div>
                        </>
                     )}

                     <div className="btn-center mt-4">
                        <button type="submit" className="btn btn-primary">
                           {type === "update" ? "Update" : "Reserve Now!"}
                        </button>
                     </div>
                  </form>
               </>
            );
         default:
            break;
      }
   };

   return (
      <div className="schedule row pt-2">
         {type === "update" && (
            <PopUp
               toggleModal={toggleModal}
               setToggleModal={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     toggleModal: !toggleModal,
                  }))
               }
               confirm={() =>
                  updateReservation(
                     {
                        captain,
                        dateFrom: moment(dateFrom).format(
                           "YYYY-MM-DD[T]HH:mm:SS[Z]"
                        ),
                        dateTo: moment(dateTo).format(
                           "YYYY-MM-DD[T]HH:mm:SS[Z]"
                        ),
                     },
                     reservation._id,
                     loggedUser.type
                  )
               }
               text="Are you sure you want to modify the reservation?"
               type="confirmation"
            />
         )}

         <div className="row-item">
            <div className="my-3">
               <Calendar
                  value={date}
                  onChange={onChangeDate}
                  minDate={today}
                  maxDate={
                     new Date(
                        today.getFullYear() + 1,
                        today.getMonth(),
                        today.getDate()
                     )
                  }
                  onActiveStartDateChange={(e) => {
                     if (e.view === "month") {
                        checkMonthAvailability(
                           vessel._id,
                           e.activeStartDate.getMonth(),
                           e.activeStartDate.getFullYear(),
                           hoursDiff,
                           reservation ? originalDateFrom : null,
                           true
                        );
                     }
                  }}
                  tileDisabled={tileDisabled}
               />
            </div>
         </div>
         <div className="row-item">{tabOpen()}</div>
      </div>
   );
};

Schedule.propTypes = {
   auth: PropTypes.object.isRequired,
   reservations: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   days: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   checkAvailableCaptains: PropTypes.func.isRequired,
   checkDayAvailability: PropTypes.func.isRequired,
   checkMonthAvailability: PropTypes.func.isRequired,
   updateReservation: PropTypes.func.isRequired,
   registerReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   days: state.days,
   users: state.users,
   reservations: state.reservations,
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   checkAvailableCaptains,
   checkDayAvailability,
   checkMonthAvailability,
   updateReservation,
   registerReservation,
})(Schedule);
