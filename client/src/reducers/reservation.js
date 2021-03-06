import {
   PAYMENT_CANCELED,
   PAYMENT_REGISTERED,
   REMOVERESERVATION_ERROR,
   RESERVATIONS_CLEARED,
   RESERVATIONS_ERROR,
   RESERVATIONS_LOADED,
   RESERVATION_CLEARED,
   RESERVATION_DELETED,
   RESERVATION_LOADED,
   RESERVATION_REGISTERED,
   RESERVATION_UPDATED,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingReservation: true,
   reservation: null,
   reservations: [],
   error: {},
};

const reservationReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case RESERVATION_LOADED:
      case RESERVATION_REGISTERED:
         return {
            ...state,
            loadingReservation: false,
            reservation: payload,
            error: {},
         };
      case RESERVATIONS_LOADED:
         return {
            ...state,
            loading: false,
            reservations: payload,
            error: {},
         };
      case RESERVATION_UPDATED:
         return {
            ...state,
            loadingReservation: false,
            reservation: payload,
            error: {},
         };
      case RESERVATION_DELETED:
         return {
            ...state,
            reservations: state.reservations.filter(
               (reservation) => reservation._id !== payload
            ),
            loading: false,
            error: {},
         };
      case PAYMENT_CANCELED:
      case PAYMENT_REGISTERED:
         return {
            ...state,
            reservation: {
               ...state.reservation,
               [payload.payment]: payload,
            },
         };
      case RESERVATIONS_CLEARED:
         return initialState;
      case RESERVATION_CLEARED:
         return {
            ...state,
            loadingReservation: true,
            reservation: null,
            error: {},
         };
      case RESERVATIONS_ERROR:
         return {
            ...state,
            //reservation: null,
            reservations: [],
            loadingReservation: false,
            loading: false,
            error: payload,
         };
      case REMOVERESERVATION_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      default:
         return state;
   }
};

export default reservationReducer;
