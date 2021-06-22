import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadReservations,
   cancelDeleteReservation,
   clearReservations,
} from "../../../actions/reservation";
import { setAlert } from "../../../actions/alert";

import Alert from "../../shared/Alert";
import ReservationInfo from "../../shared/ReservationInfo";

const MyReservations = ({
   loadReservations,
   clearReservations,
   cancelDeleteReservation,
   setAlert,
   auth: { loggedUser, loading },
   reservations: { reservations, loading: loadingR },
}) => {
   useEffect(() => {
      if (!loading && loadingR)
         loadReservations({ customer: loggedUser._id, active: true }, true);
      else {
         let unpaid = false;
         for (let x = 0; x < reservations.length; x++) {
            if (!reservations[x].downpayment.status) {
               unpaid = true;
               break;
            }
         }

         if (unpaid)
            setAlert(
               "You have up to 24 hours to pay the resevation downpayment or it will be deleted",
               "danger",
               "2"
            );
      }
   }, [
      loadReservations,
      reservations,
      loggedUser,
      loading,
      setAlert,
      loadingR,
   ]);

   return (
      <>
         <h2 className="heading heading-primary text-primary">
            My Reservations
         </h2>
         <Alert type="2" />
         <div className="myreservations">
            {!loadingR && (
               <>
                  {reservations.length > 0 ? (
                     reservations.map((reservation) => (
                        <ReservationInfo
                           type="list"
                           reservation={reservation}
                           clearReservations={clearReservations}
                           cancelDeleteReservation={cancelDeleteReservation}
                           key={reservation._id}
                        />
                     ))
                  ) : (
                     <h4 className="heading-secondary text-danger p-5 my-5">
                        There is no reservation registered.
                     </h4>
                  )}
               </>
            )}
         </div>
      </>
   );
};

MyReservations.propTypes = {
   reservations: PropTypes.object.isRequired,
   loadReservations: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   clearReservations: PropTypes.func.isRequired,
   cancelDeleteReservation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   reservations: state.reservations,
});

export default connect(mapStateToProps, {
   loadReservations,
   setAlert,
   clearReservations,
   cancelDeleteReservation,
})(MyReservations);
