import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import PropTypes from "prop-types";
import { IoBoat, IoCalendarOutline } from "react-icons/io5";
import { FaWrench, FaUser, FaDollarSign } from "react-icons/fa";
import { ImBook } from "react-icons/im";

import {
   loadReservations,
   clearReservations,
} from "../../../actions/reservation";
import { clearUsers } from "../../../actions/user";
import { clearVessels } from "../../../actions/vessel";

import "./style.scss";

const Dashboard = ({
   reservations: { reservations, loading },
   loadReservations,
   clearVessels,
   clearUsers,
   clearReservations,
}) => {
   useEffect(() => {
      if (loading) loadReservations({ active: true, limit: 5 });
   }, [loading, loadReservations]);
   return (
      <div className="dashboard">
         <section className="section-sidebar">
            <div className="sidebar">
               <ul className="side-nav">
                  <li className="side-nav-item">
                     <Link
                        to="/reservations-list"
                        className="side-nav-link"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearReservations();
                           clearUsers();
                           clearVessels();
                        }}
                     >
                        <ImBook />
                        <span className="hide-md">&nbsp; Reservations</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/vessels-list"
                        className="side-nav-link"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearVessels();
                        }}
                     >
                        <IoBoat />
                        <span className="hide-md">&nbsp; Vessels</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/manteinance"
                        onClick={() => {
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <FaWrench />
                        <span className="hide-md">&nbsp; Manteinance</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/payment"
                        onClick={() => {
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <FaDollarSign />
                        <span className="hide-md">&nbsp; Payment</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        className="side-nav-link"
                        to="/cashregister-info"
                        onClick={() => {
                           window.scroll(0, 0);
                        }}
                     >
                        <FaUser />
                        <span className="hide-md">&nbsp; Users</span>
                     </Link>
                  </li>
               </ul>
            </div>
            <div className="sidebar-info my-2 p-3">
               <h3 className="heading-tertiary text-dark">
                  <IoCalendarOutline className="icon" /> &nbsp;
                  <Moment format="MM/DD/YY" />
               </h3>
               <div className="pt-2">
                  <h2 className="heading heading-secondary text-primary">
                     <span className="hide-sm">Upcomming</span>
                     <span className="show-sm">Next</span> Reservations
                  </h2>
                  <table>
                     <tbody>
                        {!loading &&
                           reservations.length > 0 &&
                           reservations.map((reservation) => (
                              <React.Fragment key={reservation._id}>
                                 <tr className="show-sm">
                                    <td>
                                       <span className="border-btm">
                                          {reservation.vessel.name}
                                       </span>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td className="hide-md">
                                       {reservation.vessel.name}
                                    </td>
                                    <td>
                                       <Moment
                                          date={reservation.dateFrom}
                                          format="MM/DD/YY"
                                          utc
                                       />
                                    </td>
                                    <td>
                                       <Moment
                                          date={reservation.dateFrom}
                                          format="H a"
                                          utc
                                       />
                                    </td>
                                    <td>
                                       <Moment
                                          date={reservation.dateTo}
                                          format={
                                             moment(reservation.dateFrom)
                                                .utc()
                                                .format("MM/DD/YY") !==
                                             moment(reservation.dateTo)
                                                .utc()
                                                .format("MM/DD/YY")
                                                ? "MM/DD/YY - h a"
                                                : "h a"
                                          }
                                          utc
                                       />
                                    </td>
                                    <td className="hide-md">
                                       {reservation.crew &&
                                          reservation.crew.captain &&
                                          reservation.crew.captain.name +
                                             " " +
                                             reservation.crew.captain.lastname}
                                    </td>
                                    <td className="hide-md">
                                       {reservation.downpayment.status ===
                                       "success"
                                          ? "Paid"
                                          : "Not Paid"}
                                    </td>
                                 </tr>
                              </React.Fragment>
                           ))}
                     </tbody>
                  </table>
                  <div className="btn-right">
                     <Link
                        to="/reservations-list"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearReservations();
                        }}
                        className="btn btn-secondary"
                     >
                        See All
                     </Link>
                  </div>
               </div>
               <div className="pt-2">
                  <h2 className="heading heading-secondary text-primary">
                     Relevant Information
                  </h2>
                  <table className="info">
                     <tbody>
                        <tr>
                           <td>Vessels:</td>
                           <td>2</td>
                        </tr>
                        <tr>
                           <td>Captains:</td>
                           <td>2</td>
                        </tr>
                        <tr>
                           <td>Active Reservations:</td>
                           <td>14</td>
                        </tr>
                        <tr>
                           <td>Daily Income:</td>
                           <td>$ 8,400</td>
                        </tr>
                        <tr>
                           <td>Weekly Income:</td>
                           <td>$ 21,400</td>
                        </tr>
                        <tr>
                           <td>Pending Manteinance:</td>
                           <td>4 Issues</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </section>
      </div>
   );
};

Dashboard.propTypes = {
   reservations: PropTypes.object.isRequired,
   loadReservations: PropTypes.func.isRequired,
   clearVessels: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
   clearUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
});

export default connect(mapStateToProps, {
   loadReservations,
   clearVessels,
   clearReservations,
   clearUsers,
})(Dashboard);
