import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import moment from "moment";
import Calendar from "react-calendar";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   checkDayAvailability,
   checkMonthAvailability,
} from "../../../../actions/day";
import { checkAvailableCaptains, clearUsers } from "../../../../actions/user";

const Schedule = ({
   days: { day, availableHours, loadingAvailableHours, disabledDays },
   checkMonthAvailability,
   checkDayAvailability,
   checkAvailableCaptains,
   vessel,
   updateDates,
   clearUsers,
}) => {
   const today = new Date();
   today.setDate(today.getDate() + 1);
   today.setHours(0, 0, 0);

   const [adminValues, setAdminValues] = useState({
      date: new Date(),
      tab: 0,
      possiblesDateTo: [],
      oldVessel: "",
      dateFrom: "",
      dateTo: "",
      charterValue: 0,
   });

   const {
      date,
      tab,
      possiblesDateTo,
      oldVessel,
      dateFrom,
      dateTo,
      charterValue,
   } = adminValues;

   useEffect(() => {
      if (
         oldVessel === "" ||
         (oldVessel !== "" && oldVessel._id !== vessel._id)
      ) {
         const today = new Date();
         checkMonthAvailability(
            vessel._id,
            today.getMonth(),
            today.getFullYear()
         );
         setAdminValues((prev) => ({
            ...prev,
            oldVessel: vessel,
            tab: 0,
         }));
      }
   }, [checkMonthAvailability, vessel, oldVessel]);

   const onChangeDate = (changedDate) => {
      setAdminValues((prev) => ({
         ...prev,
         date: changedDate,
         tab: 1,
      }));
      checkDayAvailability(
         vessel._id,
         moment(changedDate).format("YYYY-MM-DD[T00:00:00Z]")
      );
      clearUsers();
   };

   const selectDateFrom = (time) => {
      const newDate = new Date(date);
      newDate.setHours(time);

      let possiblesDateTo = [];

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

      setAdminValues((prev) => ({
         ...prev,
         tab: 2,
         possiblesDateTo,
         dateFrom: newDate,
      }));
   };

   const selectDateTo = (item) => {
      const newDate = new Date(date);
      newDate.setHours(dateFrom.getHours() + vessel.prices[item].time);

      const momentFDate = moment(dateFrom).format("YYYY-MM-DD[T]HH:mm:SS[Z]");
      const momentTDate = moment(newDate).format("YYYY-MM-DD[T]HH:mm:SS[Z]");

      checkAvailableCaptains(momentFDate, momentTDate);

      setAdminValues((prev) => ({
         ...prev,
         tab: 3,
         dateTo: newDate,
         charterValue: vessel.prices[item].price,
      }));
      updateDates(momentFDate, momentTDate, vessel.prices[item].price);
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
                  <p className="schedule-info">
                     <span className="text-primary">Price:</span> $
                     {charterValue}
                  </p>
               </>
            );
         default:
            break;
      }
   };

   return (
      <div className="schedule row pt-2">
         <div className="row-item">
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
                        null,
                        null,
                        true
                     );
                  }
               }}
               tileDisabled={tileDisabled}
            />
         </div>
         <div className="row-item">{tabOpen()}</div>
      </div>
   );
};

Schedule.propTypes = {
   days: PropTypes.object.isRequired,
   checkAvailableCaptains: PropTypes.func.isRequired,
   checkDayAvailability: PropTypes.func.isRequired,
   checkMonthAvailability: PropTypes.func.isRequired,
   clearUsers: PropTypes.func.isRequired,
   updateDates: PropTypes.func.isRequired,
   vessel: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   days: state.days,
});

export default connect(mapStateToProps, {
   checkAvailableCaptains,
   checkDayAvailability,
   checkMonthAvailability,
   clearUsers,
})(Schedule);
