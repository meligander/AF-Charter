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
import {
   clearMaintenances,
   loadMaintenances,
} from "../../../actions/maintenance";
import { clearUsers, loadUsers } from "../../../actions/user";
import { clearVessels, loadVessels } from "../../../actions/vessel";
import { loadTotalTime } from "../../../actions/payment";
import { formatNumber } from "../../../actions/mixvalues";

import "./style.scss";

const Dashboard = ({
   reservations: { reservations, loading },
   vessels: { vessels },
   maintenances: { maintenances },
   users: { users },
   payments: {
      otherData: { dailyPayments, weeklyPayments, monthlyPayments },
   },
   loadReservations,
   clearVessels,
   clearUsers,
   clearReservations,
   clearMaintenances,
   loadMaintenances,
   loadUsers,
   loadVessels,
   loadTotalTime,
}) => {
   useEffect(() => {
      if (loading) {
         loadTotalTime("days");
         loadTotalTime("weeks");
         loadTotalTime("months");
         loadMaintenances({ closed: false }, true);
         loadReservations({ active: true }, null, true);
         loadVessels({ active: true }, true);
         loadUsers({ active: true, type: "captain" }, true);
      }
   }, [
      loading,
      loadReservations,
      loadVessels,
      loadUsers,
      loadMaintenances,
      loadTotalTime,
   ]);
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
                        to="/maintenance-list"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearMaintenances();
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
                        to="/users-list"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearUsers();
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
                           reservations.map(
                              (reservation, i) =>
                                 i < 5 && (
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
                                                   reservation.crew.captain
                                                      .lastname}
                                          </td>
                                          <td className="hide-md">
                                             {reservation.downpayment.status ===
                                             "success"
                                                ? "Paid"
                                                : "Not Paid"}
                                          </td>
                                       </tr>
                                    </React.Fragment>
                                 )
                           )}
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
                           <td>{vessels.length}</td>
                        </tr>
                        <tr>
                           <td>Captains:</td>
                           <td>{users.length}</td>
                        </tr>
                        <tr>
                           <td>Active Reservations:</td>
                           <td>{reservations.length}</td>
                        </tr>
                        <tr>
                           <td>Day's Income:</td>
                           <td>$ {formatNumber(dailyPayments)}</td>
                        </tr>
                        <tr>
                           <td>Week's Income:</td>
                           <td>$ {formatNumber(weeklyPayments)}</td>
                        </tr>
                        <tr>
                           <td>Month's Income:</td>
                           <td>$ {formatNumber(monthlyPayments)}</td>
                        </tr>
                        <tr>
                           <td>Pending Manteinance:</td>
                           <td>{`${maintenances.length} Issue${
                              maintenances.length === 1 ? "" : "s"
                           }`}</td>
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
   maintenances: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   payments: PropTypes.object.isRequired,
   loadReservations: PropTypes.func.isRequired,
   clearVessels: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
   clearUsers: PropTypes.func.isRequired,
   clearMaintenances: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   loadMaintenances: PropTypes.func.isRequired,
   loadVessels: PropTypes.func.isRequired,
   loadTotalTime: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   vessels: state.vessels,
   maintenances: state.maintenances,
   users: state.users,
   payments: state.payments,
});

export default connect(mapStateToProps, {
   loadReservations,
   clearVessels,
   clearReservations,
   clearUsers,
   clearMaintenances,
   loadMaintenances,
   loadVessels,
   loadUsers,
   loadTotalTime,
})(Dashboard);
