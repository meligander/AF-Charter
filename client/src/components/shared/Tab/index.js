import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

import "./style.scss";

const Tabs = ({ tablist, panellist }) => {
   const [adminValues, setAdminValues] = useState({
      isActive: 0,
      width: 0,
      position: 0,
      refs: useMemo(
         () =>
            Array(tablist.length)
               .fill(0)
               .map((i) => React.createRef()),
         [tablist.length]
      ),
   });

   const { isActive, width, position, refs } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         isActive: 0,
         width: refs[0].current.offsetWidth,
         position: refs[0].current.offsetLeft,
      }));
   }, [refs]);

   const changeActive = (nb) => {
      setAdminValues((prev) => ({
         ...prev,
         isActive: nb,
         width: refs[nb].current.offsetWidth,
         position: refs[nb].current.offsetLeft,
      }));
   };

   return (
      <section className="section-tab ">
         <div className="tab-header">
            {tablist.map((tab, index) => (
               <button
                  type="button"
                  className="tab-header-btn"
                  key={index}
                  onClick={() => changeActive(index)}
                  ref={refs[index]}
               >
                  {tablist.length > 3 ? (
                     <>
                        {tab.substring(0, 3)}
                        <span className="hide-sm">{tab.substring(3)}</span>
                     </>
                  ) : (
                     tab
                  )}
               </button>
            ))}
         </div>
         <div className="tab-header-line">
            <div style={{ width, left: position }} className="line"></div>
         </div>
         {panellist.map((Panel, index) => (
            <div
               key={index}
               className={`tab-content-panel ${
                  isActive === index ? "active" : ""
               } ${index % 2 === 0 ? "even" : "odd"}`}
            >
               <Panel />
            </div>
         ))}
      </section>
   );
};

Tabs.prototypes = {
   tablist: PropTypes.array.isRequired,
   panellist: PropTypes.array.isRequired,
};

export default Tabs;
