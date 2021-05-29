import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import Calendar from "react-calendar";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   checkDayAvailability,
   checkMonthAvailability,
} from "../../../actions/day";
import { checkAvailableCaptains } from "../../../actions/user";

import Alert from "../../shared/Alert";

import "./style.scss";

const Schedule = ({
   vessel,
   type,
   reservation,
   saveData,
   days: { day, availableHours, loadingAvailableHours, disabledDays },
   users: { users, loading },
   checkMonthAvailability,
   checkDayAvailability,
   checkAvailableCaptains,
}) => {
   const today = new Date();
   today.setDate(today.getDate() + 1);
   today.setHours(0, 0, 0, 0);

   let hoursDiff = 0;

   if (reservation) {
      const originalDateFrom = new Date(reservation.dateFrom);
      const originalDateTo = new Date(reservation.dateTo);

      const milliseconds = Math.abs(originalDateFrom - originalDateTo);
      hoursDiff = milliseconds / 36e5;
   }

   const [adminValues, setAdminValues] = useState({
      date: today,
      tab: 1,
      possiblesDateTo: [],
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

   const { date, tab, possiblesDateTo } = adminValues;

   useEffect(() => {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      today.setHours(0, 0, 0, 0);
      checkMonthAvailability(
         vessel._id,
         today.getMonth(),
         today.getFullYear(),
         type === "update" && hoursDiff,
         false
      );
      checkDayAvailability(vessel._id, today, type === "update" && hoursDiff);
   }, [
      checkAvailableCaptains,
      checkDayAvailability,
      checkMonthAvailability,
      vessel._id,
      hoursDiff,
      type,
   ]);

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
      checkDayAvailability(vessel._id, changedDate, hoursDiff);
   };

   const selectDateFrom = (time) => {
      const newDate = new Date(date);
      newDate.setHours(time);

      let possiblesDateTo = [];
      let newToDate;

      if (type === "update") {
         newToDate = new Date(newDate);
         newToDate.setHours(newDate.getHours() + hoursDiff);

         checkAvailableCaptains(newDate, newToDate);
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

      checkAvailableCaptains(dateFrom, newDate);

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
                  <Alert type="3" />
                  <p className="schedule-info">
                     <span className="text-primary">{`Date${
                        diff ? "s" : ""
                     }:`}</span>{" "}
                     &nbsp;
                     <Moment date={dateFrom} format="MM/DD/YY" />
                     {`${
                        diff
                           ? "- " + <Moment date={dateTo} format="MM/DD/YY" />
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
                  <p className="schedule-info text-primary">Captain:</p>
                  <form
                     className="form"
                     onSubmit={(e) => {
                        e.preventDefault();
                        saveData(formData);
                     }}
                  >
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
                           <p className="text-danger">No captain available</p>
                        )}
                     </div>
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
   type: PropTypes.string.isRequired,
   reservation: PropTypes.object,
   vessel: PropTypes.object.isRequired,
   days: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   checkAvailableCaptains: PropTypes.func.isRequired,
   checkDayAvailability: PropTypes.func.isRequired,
   checkMonthAvailability: PropTypes.func.isRequired,
   saveData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   days: state.days,
   users: state.users,
});

export default connect(mapStateToProps, {
   checkAvailableCaptains,
   checkDayAvailability,
   checkMonthAvailability,
})(Schedule);
