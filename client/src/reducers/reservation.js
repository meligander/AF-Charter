import {
   RESERVATIONS_CLEARED,
   RESERVATIONS_ERROR,
   RESERVATIONS_LOADED,
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
            loading: false,
            reservations: [...state.reservations, payload],
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
      case RESERVATIONS_CLEARED:
         return initialState;
      case RESERVATIONS_ERROR:
         return {
            ...state,
            user: null,
            users: [],
            loadingUser: false,
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
};

export default reservationReducer;
