import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus, BiSave } from "react-icons/bi";

import {
   saveDiscrepancy,
   deleteDiscrepancy,
   removeDiscrepancyError,
} from "../../../../actions/discrepancy";

import Alert from "../../../shared/Alert";

import "./style.scss";

const DiscrepaciesTab = ({
   discrepancies: { discrepancies: oldDiscrepancies, error },
   reservation,
   saveDiscrepancy,
   deleteDiscrepancy,
   removeDiscrepancyError,
}) => {
   const [discrepancies, setDiscrepancies] = useState([]);

   const [adminValues, setAdminValues] = useState({
      count: 0,
      toUpdate: 0,
   });

   const { count, toUpdate } = adminValues;

   useEffect(() => {
      setDiscrepancies((prev) => {
         const toAdd =
            prev.length > oldDiscrepancies.length
               ? prev.filter((item) => typeof item._id === "number")
               : [];
         return [
            ...oldDiscrepancies.map((item) => ({
               ...item,
               maintenance: item.maintenance ? true : false,
            })),
            ...toAdd,
         ];
      });
   }, [oldDiscrepancies]);

   const onChange = (e) => {
      let newDiscrepancies = [...discrepancies];
      const index = Number(e.target.id.substring(1));

      newDiscrepancies[index] = {
         ...newDiscrepancies[index],
         [e.target.name]:
            e.target.name !== "maintenance" ? e.target.value : e.target.checked,
      };

      setDiscrepancies(newDiscrepancies);

      if (error.constructor === Array && error.length > 0 && toUpdate === index)
         removeDiscrepancyError(e.target.name);
   };

   const addDiscrepancySet = () => {
      let newDiscrepancies = [...discrepancies];

      newDiscrepancies.push({
         _id: count,
         time: "",
         description: "",
         maintenance: false,
      });
      setDiscrepancies(newDiscrepancies);
      setAdminValues((prev) => ({ ...prev, count: count + 1 }));
   };

   const same = (item, i) => {
      const discrep = {
         ...oldDiscrepancies[i],
         maintenance: oldDiscrepancies[i].maintenance ? true : false,
      };

      return JSON.stringify(discrep) === JSON.stringify(item);
   };

   return (
      <div className="discrepancies">
         <form className="form">
            <Alert type="2" />
            {discrepancies.length > 0 &&
               discrepancies.map((item, i) => (
                  <div className="form-group several-input" key={i}>
                     <div>
                        <div className="two-in-row">
                           <label className="form-label">Time</label>
                           <label className="form-label">Description</label>
                           <label className="form-label dif">
                              Maint<span className="hide-sm">enance</span>
                           </label>
                        </div>
                        <div className="two-in-row">
                           <select
                              name="time"
                              id={`t${i}`}
                              className={`form-input ${
                                 error.constructor === Array &&
                                 error.some(
                                    (value) => value.param === "time"
                                 ) &&
                                 i === toUpdate
                                    ? "invalid"
                                    : ""
                              }`}
                              onChange={onChange}
                              value={item.time}
                           >
                              <option value="">* Select Time</option>
                              <option value="before">Before</option>
                              <option value="during">During</option>
                              <option value="after">After</option>
                           </select>
                           <textarea
                              placeholder="Description"
                              name="description"
                              id={`d${i}`}
                              className={`form-input ${
                                 error.constructor === Array &&
                                 error.some(
                                    (value) => value.param === "description"
                                 ) &&
                                 i === toUpdate
                                    ? "invalid"
                                    : ""
                              }`}
                              value={item.description}
                              onChange={onChange}
                              rows="3"
                           ></textarea>
                           <div>
                              <input
                                 className="form-input-checkbox"
                                 type="checkbox"
                                 onChange={onChange}
                                 checked={item.maintenance}
                                 name="maintenance"
                                 id={`c${i}`}
                              />
                              <label
                                 className="form-lbl-switch"
                                 htmlFor={`c${i}`}
                              ></label>
                           </div>
                        </div>
                     </div>
                     {typeof item._id === "number" ||
                     (oldDiscrepancies[i] && !same(item, i)) ? (
                        <button
                           type="button"
                           onClick={() => {
                              saveDiscrepancy(discrepancies[i], reservation);
                              setAdminValues((prev) => ({
                                 ...prev,
                                 toUpdate: i,
                              }));
                           }}
                           className="btn-text success"
                        >
                           <BiSave className="icon" />
                        </button>
                     ) : (
                        <button
                           className="btn-text danger"
                           type="button"
                           onClick={() => deleteDiscrepancy(item._id)}
                        >
                           <AiOutlineDelete className="icon" />
                        </button>
                     )}
                  </div>
               ))}
            <div className="btn-right">
               <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addDiscrepancySet}
               >
                  <BiPlus className="icon" /> Discrepancy
               </button>
            </div>
         </form>
      </div>
   );
};

DiscrepaciesTab.propTypes = {
   discrepancies: PropTypes.object.isRequired,
   reservation: PropTypes.object.isRequired,
   saveDiscrepancy: PropTypes.func.isRequired,
   deleteDiscrepancy: PropTypes.func.isRequired,
   removeDiscrepancyError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   discrepancies: state.discrepancies,
   reservation: state.reservations.reservation,
});

export default connect(mapStateToProps, {
   saveDiscrepancy,
   deleteDiscrepancy,
   removeDiscrepancyError,
})(DiscrepaciesTab);
