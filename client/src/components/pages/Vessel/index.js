import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { GiSailboat } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { ImLifebuoy } from "react-icons/im";
import { FaAnchor } from "react-icons/fa";
import Calendar from "react-calendar";
import PropTypes from "prop-types";

import { loadVessel } from "../../../actions/vessel";

import Photo from "../../modal/Photo";

import "./style.scss";

const Vessel = ({
   loadVessel,
   vessels: { vessel, loadingVessel: loading },
   match,
}) => {
   const _id = match.params.vessel_id;
   const today = new Date();

   const [adminValues, setAdminValues] = useState({
      mainImg: "",
      togglePhoto: false,
      number: 0,
      oneDay: false,
      tab: 1,
      //change it with the reservation avalability
      hoursArray: [],
   });

   const [formData, setFormData] = useState({
      date: today,
      startTime: "",
      endTime: "",
      charterValue: 0,
   });

   const {
      mainImg,
      togglePhoto,
      number,
      oneDay,
      hoursArray,
      tab,
   } = adminValues;

   const { date, startTime, endTime, charterValue } = formData;

   useEffect(() => {
      if (loading) loadVessel(_id);
      else {
         let mainImg = "";

         for (let x = 0; x < vessel.images.length; x++) {
            if (vessel.images[x].default) {
               mainImg = vessel.images[x].filePath;
               break;
            }
         }

         let hour = 8;
         let array = [];

         while (hour <= 18) {
            array.push(
               hour % 12 === 0
                  ? "12 pm"
                  : hour > 12
                  ? (hour % 12) + " pm"
                  : (hour % 12) + " am"
            );
            hour++;
         }

         setAdminValues((prev) => ({
            ...prev,
            mainImg,
            hoursArray: array,
         }));
      }
   }, [loading, loadVessel, _id, vessel]);

   const toggleBig = () => {
      setAdminValues((prev) => ({
         ...prev,
         togglePhoto: false,
      }));
   };

   const onChangeDate = (newDate) => {
      setFormData((prev) => ({
         ...prev,
         date: newDate,
      }));

      let hour = 8;
      let array = [];

      while (hour <= 18) {
         array.push(
            hour % 12 === 0
               ? "12 pm"
               : hour > 12
               ? (hour % 12) + " pm"
               : (hour % 12) + " am"
         );
         hour++;
      }

      setAdminValues((prev) => ({
         ...prev,
         tab: 1,
         hoursArray: array,
      }));
   };

   const onChangeOneDay = () => {
      setAdminValues((prev) => ({
         ...prev,
         oneDay: !oneDay,
      }));
      setFormData((prev) => ({
         ...prev,
         date: today,
      }));
   };

   const selectStartTime = (hour) => {
      const onlyTime = hour.substring(0, hour.length - 2);
      let time = new Date(2000, 0, 1, onlyTime);
      setFormData((prev) => ({
         ...prev,
         startTime: time,
      }));

      let array = [];

      for (let x = 0; x < vessel.prices.length; x++) {
         let newTime = Number(onlyTime) + vessel.prices[x].time;
         array.push({
            time:
               newTime % 12 === 0
                  ? "12 pm"
                  : newTime > 12
                  ? (newTime % 12) + " pm"
                  : (newTime % 12) + " am",
            price: vessel.prices[x].price,
         });
      }

      setAdminValues((prev) => ({
         ...prev,
         hoursArray: array,
         tab: 2,
      }));
   };

   const selectEndTime = (hour) => {
      const onlyTime = hour.time.substring(0, hour.time.length - 2);
      const am =
         hour.time.substring(hour.time.length - 2, hour.time.length) === "am";
      let time = new Date(
         2000,
         0,
         1,
         am ? onlyTime : onlyTime === 12 ? 12 : Number(onlyTime) + 12
      );
      setFormData((prev) => ({
         ...prev,
         endTime: time,
         charterValue: hour.price,
      }));
      setAdminValues((prev) => ({
         ...prev,
         tab: 3,
      }));
   };

   const tabOpen = () => {
      switch (tab) {
         case 1:
            return (
               <>
                  <p className="vessel-hour-title">From:</p>
                  {hoursArray.length > 0 &&
                     hoursArray.map((hour, i) => (
                        <div
                           className="vessel-hour-item"
                           key={i}
                           onClick={() => selectStartTime(hour)}
                        >
                           {hour}
                        </div>
                     ))}
               </>
            );
         case 2:
            return (
               <>
                  <p className="vessel-hour-title">To:</p>
                  {hoursArray.length > 0 &&
                     hoursArray.map((hour, i) => (
                        <div
                           className="vessel-hour-item"
                           key={i}
                           onClick={() => selectEndTime(hour)}
                        >
                           {hour.time} - ${hour.price}
                        </div>
                     ))}
               </>
            );
         case 3:
            return (
               <>
                  <p className="vessel-hour-title pb-2">Reservation Info:</p>
                  <p className="vessel-hour-info">
                     <span className="text-primary">Date:</span>{" "}
                     {date.getMonth() +
                        1 +
                        "-" +
                        date.getDate() +
                        "-" +
                        date.getFullYear()}
                  </p>
                  <p className="vessel-hour-info">
                     <span className="text-primary">Time:</span>{" "}
                     {startTime.getHours() % 12 === 0
                        ? "12 pm"
                        : startTime.getHours() > 12
                        ? (startTime.getHours() % 12) + " pm"
                        : (startTime.getHours() % 12) + " am"}{" "}
                     -{" "}
                     {endTime.getHours() % 12 === 0
                        ? "12 pm"
                        : endTime.getHours() > 12
                        ? (endTime.getHours() % 12) + " pm"
                        : (endTime.getHours() % 12) + " am"}
                  </p>
                  <p className="vessel-hour-info">
                     <span className="text-primary">Price:</span> $
                     {charterValue}
                  </p>
                  <div className="btn-center">
                     <button type="button" className="btn btn-primary">
                        Reserve Now!
                     </button>
                  </div>
               </>
            );
         default:
            break;
      }
   };

   return (
      <div className="vessel">
         {togglePhoto && (
            <Photo
               images={vessel.images}
               number={number}
               togglePhoto={toggleBig}
            />
         )}
         {!loading && (
            <>
               <h2 className="heading heading-primary text-center">
                  {vessel.name} <div className="underline"></div>
               </h2>
               <div
                  className="vessel-img"
                  style={{
                     backgroundImage: `url( ${mainImg})`,
                  }}
               ></div>
               <div className="row">
                  <div className="row-item">
                     <h4 className="heading heading-secondary">About</h4>
                     We offer boat charters in the Miami area, giving a
                     one-on-one experience to all of our guests. Great boat to
                     cruise around Miami waters, comes with ice and some
                     refreshments.
                  </div>
                  <div className="row-item">
                     <h4 className="heading heading-secondary">
                        What to Bring
                     </h4>
                     <ul>
                        <li>
                           <GiSailboat className="icon" /> &nbsp;Be sure to
                           bring food and drinks
                        </li>
                        <li>
                           <GiSailboat className="icon" /> &nbsp;Wear
                           comfortable clothing
                        </li>
                        <li>
                           <GiSailboat className="icon" /> &nbsp;Bring a sweater
                           or jacket on cool days
                        </li>
                     </ul>
                  </div>
               </div>
               <div className="row">
                  <div className="row-item">
                     <h4 className="heading heading-secondary ">Rates</h4>
                     <ul>
                        {vessel.prices.length > 0 &&
                           vessel.prices.map((price, i) => (
                              <li key={i}>
                                 <BiTimeFive className="icon" /> &nbsp;
                                 <span className="text-primary">
                                    {price.time} hours:
                                 </span>{" "}
                                 &nbsp; $ {price.price}
                              </li>
                           ))}
                     </ul>
                  </div>
                  <div className="row-item">
                     <h4 className="heading heading-secondary">
                        Specifications
                     </h4>
                     <ul>
                        <li>
                           <ImLifebuoy className="icon" /> &nbsp;
                           <span className="text-primary">
                              Sleeping places:
                           </span>{" "}
                           &nbsp; {vessel.peopleSleep}
                        </li>
                        <li>
                           <ImLifebuoy className="icon" /> &nbsp;
                           <span className="text-primary">Capacity:</span>{" "}
                           &nbsp; {vessel.peopleOnBoard}
                        </li>
                     </ul>
                  </div>
                  <div className="row-item">
                     <h4 className="heading heading-secondary">Equipment</h4>
                     <ul>
                        {vessel.equipment.length > 0 &&
                           vessel.equipment.map((item, i) => (
                              <li key={i}>
                                 <FaAnchor className="icon" /> &nbsp; {item}
                              </li>
                           ))}
                     </ul>
                  </div>
               </div>
               <div className="p-2">
                  <h4 className="heading heading-secondary ">Gallery</h4>
                  <div className="vessel-gallery">
                     {vessel.images.length > 0 &&
                        vessel.images.map(
                           (img, i) =>
                              !img.default && (
                                 <div
                                    key={i}
                                    style={{
                                       backgroundImage: `url( ${img.filePath})`,
                                    }}
                                    className="vessel-gallery-img"
                                    onClick={() =>
                                       setAdminValues((prev) => ({
                                          ...prev,
                                          number: i,
                                          togglePhoto: true,
                                       }))
                                    }
                                 ></div>
                              )
                        )}
                  </div>
               </div>
               <h4 className="heading heading-primary text-center mt-3">
                  Availability
               </h4>
               <div className="row">
                  <div className="row-item">
                     <div className="my-3">
                        <Calendar
                           value={date}
                           selectRange={oneDay}
                           onChange={(e) => onChangeDate(e)}
                           minDate={today}
                           maxDate={
                              new Date(
                                 today.getFullYear() + 1,
                                 today.getMonth(),
                                 today.getDate()
                              )
                           }
                        />
                     </div>
                     <div className="form-group">
                        <input
                           className="form-input-checkbox"
                           type="checkbox"
                           id="oneDay"
                           onChange={onChangeOneDay}
                           value={oneDay}
                        />
                        <label className="form-lbl-checkbox" htmlFor="oneDay">
                           More than a day
                        </label>
                     </div>
                  </div>
                  <div className="row-item vessel-hour">{tabOpen()}</div>
               </div>
            </>
         )}
      </div>
   );
};

Vessel.propTypes = {
   loadVessel: PropTypes.func.isRequired,
   vessels: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   vessels: state.vessels,
});

export default connect(mapStateToProps, { loadVessel })(Vessel);
