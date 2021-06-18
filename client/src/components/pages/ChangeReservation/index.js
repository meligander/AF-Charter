import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ReservationInfo from "../../shared/ReservationInfo";
import PaymentInfo from "../../shared/PaymentInfo";
import Schedule from "../../shared/Schedule";

import { loadReservation } from "../../../actions/reservation";

const ChangeReservation = ({
   reservations: { reservation, loadingReservation },
   match,
   loadReservation,
   location,
}) => {
   const _id = match.params.reservation_id;
   const payment = location.pathname.replace(`/${_id}`, "") === "/payment";

   useEffect(() => {
      if (loadingReservation) {
         loadReservation(_id);
      }
   }, [loadReservation, loadingReservation, _id]);

   return (
      !loadingReservation && (
         <div className="reserve-update">
            <h2 className="heading heading-primary text-primary">
               Reservation {payment ? "Payment" : "Update"}
            </h2>
            <ReservationInfo reservation={reservation} type="update" />
            {payment ? <PaymentInfo /> : <Schedule />}
         </div>
      )
   );
};

ChangeReservation.propTypes = {
   reservations: PropTypes.object.isRequired,
   loadReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
});

export default connect(mapStateToProps, {
   loadReservation,
})(ChangeReservation);
