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
      top: 0,
   });

   const { isActive, width, position, refs, top } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         isActive: 0,
         width: refs[0].current.offsetWidth,
         position: refs[0].current.offsetLeft,
         top: refs[0].current.offsetTop + refs[0].current.offsetHeight,
      }));
   }, [refs]);

   const changeActive = (nb) => {
      setAdminValues((prev) => ({
         ...prev,
         isActive: nb,
         width: refs[nb].current.offsetWidth,
         position: refs[nb].current.offsetLeft,
         top: refs[nb].current.offsetTop + refs[nb].current.offsetHeight,
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
                  {tab.length > 3 ? (
                     <>
                        {tab}
                        {/* {tab.substring(0, 4)}
                        <span className="hide-md">{tab.substring(4)}</span> */}
                     </>
                  ) : (
                     tab
                  )}
               </button>
            ))}
            <div className="tab-header-line" style={{ top }}>
               <div style={{ width, left: position }} className="line"></div>
            </div>
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
