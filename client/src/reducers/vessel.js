import {
   VESSEL_LOADED,
   VESSELS_LOADED,
   VESSEL_REGISTERED,
   VESSEL_UPDATED,
   VESSEL_DELETED,
   VESSELS_CLEARED,
   VESSELS_ERROR,
   VESSEL_ERROR,
   VESSEL_CLEARED,
   REMOVEVESSEL_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingVessel: true,
   vessel: null,
   vessels: [],
   error: {},
};

const vesselReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case VESSEL_LOADED:
         return {
            ...state,
            loadingVessel: false,
            vessel: payload,
            error: {},
         };
      case VESSELS_LOADED:
         return {
            ...state,
            loading: false,
            vessels: payload,
            error: {},
         };
      case VESSEL_REGISTERED:
         return {
            ...state,
            loading: false,
            vessels: [...state.vessels, payload],
            error: {},
         };
      case VESSEL_UPDATED:
         return {
            ...state,
            loading: false,
            vessel: payload,
            loadingVessel: false,
            vessels: state.vessels.map((vessel) =>
               vessel._id !== payload._id ? vessel : payload
            ),
            error: {},
         };
      case VESSEL_DELETED:
         return {
            ...state,
            vessels: state.vessels.filter((vessel) => vessel._id !== payload),
            loading: false,
            error: {},
         };
      case VESSELS_CLEARED:
         return initialState;
      case VESSEL_CLEARED:
         return {
            ...state,
            vessel: null,
            loadingVessel: true,
            error: {},
         };
      case VESSELS_ERROR:
         return {
            ...state,
            vessel: null,
            vessels: [],
            loading: false,
            loadingVessel: false,
            error: payload,
         };
      case VESSEL_ERROR:
         return {
            ...state,
            vessel: null,
            loadingVessel: false,
            error: payload,
         };
      case REMOVEVESSEL_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      default:
         return state;
   }
};

export default vesselReducer;
