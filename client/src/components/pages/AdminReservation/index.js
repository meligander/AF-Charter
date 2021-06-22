import React, { useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

import ReservationInfo from "../../shared/ReservationInfo";
import Schedule from "../../shared/Schedule";
import PaymentInfo from "../../shared/PaymentInfo";
import CrewTab from "./CrewTab";
import DiscrepaciesTab from "./DiscrepanciesTab";
import ManifestTab from "./ManifestTab";
import Tab from "../../shared/Tab";

import { loadReservation } from "../../../actions/reservation";
import { checkAvailableCaptains, loadUsers } from "../../../actions/user";
import { checkAvailableVessels } from "../../../actions/vessel";
import { loadDiscrepancies } from "../../../actions/discrepancy";

const AdminReservation = ({
   reservations: { reservation, loadingReservation },
   users: { loading, loadingAux },
   vessels: { loading: loadingVessels },
   discrepancies: { loading: loadingDiscrepancies },
   match,
   loadReservation,
   checkAvailableCaptains,
   checkAvailableVessels,
   loadUsers,
   loadDiscrepancies,
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
         loadDiscrepancies(_id);
      }
   }, [
      loadReservation,
      loadingReservation,
      _id,
      checkAvailableCaptains,
      checkAvailableVessels,
      reservation,
      loadUsers,
      loadDiscrepancies,
   ]);

   return (
      !loadingReservation &&
      !loading &&
      !loadingAux &&
      !loadingVessels &&
      !loadingDiscrepancies && (
         <div className="reserve-update">
            <h2 className="heading heading-primary text-primary">
               Administrate Reservation
            </h2>
            <ReservationInfo reservation={reservation} type="supdate" />
            <div className="mt-4">
               {reservation.active ? (
                  <Tab
                     tablist={[
                        "Reschedule",
                        "Crew",
                        "Payment",
                        "Discrepancies",
                        "Manifest",
                     ]}
                     panellist={[
                        Schedule,
                        CrewTab,
                        PaymentInfo,
                        DiscrepaciesTab,
                        ManifestTab,
                     ]}
                  />
               ) : (
                  <Tab
                     tablist={["Payment", "Discrepancies"]}
                     panellist={[PaymentInfo, DiscrepaciesTab]}
                  />
               )}
            </div>
         </div>
      )
   );
};

AdminReservation.propTypes = {
   reservations: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   vessels: PropTypes.object.isRequired,
   discrepancies: PropTypes.object.isRequired,
   loadReservation: PropTypes.func.isRequired,
   checkAvailableCaptains: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   checkAvailableVessels: PropTypes.func.isRequired,
   loadDiscrepancies: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   users: state.users,
   vessels: state.vessels,
   discrepancies: state.discrepancies,
});

export default connect(mapStateToProps, {
   loadReservation,
   checkAvailableCaptains,
   loadUsers,
   checkAvailableVessels,
   loadDiscrepancies,
})(AdminReservation);
