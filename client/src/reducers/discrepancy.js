import {
   DISCREPANCIES_CLEARED,
   DISCREPANCIES_ERROR,
   DISCREPANCIES_LOADED,
   DISCREPANCIES_UPDATED,
   DISCREPANCY_DELETED,
   REMOVEDISCREPANCY_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   discrepancies: [],
   error: {},
};

const vesselReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case DISCREPANCIES_LOADED:
         return {
            ...state,
            loading: false,
            discrepancies: payload,
            error: {},
         };
      case DISCREPANCIES_UPDATED:
         return {
            ...state,
            loading: false,
            discrepancies: state.discrepancies.some(
               (item) => item._id === payload._id
            )
               ? state.discrepancies.map((item) =>
                    item._id !== payload._id ? item : payload
                 )
               : [...state.discrepancies, payload],
            error: {},
         };
      case DISCREPANCY_DELETED:
         return {
            ...state,
            discrepancies: state.discrepancies.filter(
               (item) => item._id !== payload
            ),
            loading: false,
            error: {},
         };
      case DISCREPANCIES_CLEARED:
         return initialState;
      case DISCREPANCIES_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      case REMOVEDISCREPANCY_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      default:
         return state;
   }
};

export default vesselReducer;
