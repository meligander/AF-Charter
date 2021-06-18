import React, { useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

import ReservationInfo from "../../shared/ReservationInfo";
import Schedule from "../../shared/Schedule";
import PaymentInfo from "../../shared/PaymentInfo";
import CrewTab from "./CrewTab";
import Tab from "../../shared/Tab";

import { loadReservation } from "../../../actions/reservation";
import { checkAvailableCaptains, loadUsers } from "../../../actions/user";
import { checkAvailableVessels } from "../../../actions/vessel";

const AdminReservation = ({
   reservations: { reservation, loadingReservation },
   users: { loading, loadingAux },
   vessels: { loading: loadingVessels },
   match,
   loadReservation,
   checkAvailableCaptains,
   checkAvailableVessels,
   loadUsers,
}) => {
   const _id = match.params.reservation_id;

   useEffect(() => {
      if (loadingReservation) loadReservation(_id);
      else {
         let dateFrom = moment(reservation.dateFrom)
            .utc()
            .format("YYYY-MM-DD[T]HH:mm:SS[Z]");
         let dateTo = moment(reservation.dateTo)
            .utc()
            .format("YYYY-MM-DD[T]HH:mm:SS[Z]");

         checkAvailableCaptains(dateFrom, dateTo, _id);
         loadUsers({ active: true, type: "mate" }, false);
         checkAvailableVessels(dateFrom, dateTo, _id);
      }
   }, [
      loadReservation,
      loadingReservation,
      _id,
      checkAvailableCaptains,
      checkAvailableVessels,
      reservation,
      loadUsers,
   ]);

   return (
      !loadingReservation &&
      !loading &&
      !loadingAux &&
      !loadingVessels && (
         <div className="reserve-update">
            <h2 className="heading heading-primary text-primary">
               Administrate Reservation
            </h2>
            <ReservationInfo reservation={reservation} type="supdate" />
            <div className="mt-4">
               <Tab
                  tablist={["Reschedule", "Crew", "Payment"]}
                  panellist={[Schedule, CrewTab, PaymentInfo]}
               />
            </div>
         </div>
      )
   );
};

AdminReservation.propTypes = {
   reservations: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   loadReservation: PropTypes.func.isRequired,
   checkAvailableCaptains: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   checkAvailableVessels: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   users: state.users,
   vessels: state.vessels,
});

export default connect(mapStateToProps, {
   loadReservation,
   checkAvailableCaptains,
   loadUsers,
   checkAvailableVessels,
})(AdminReservation);
