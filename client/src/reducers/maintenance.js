import {
   MAINTENANCES_CLEARED,
   MAINTENANCES_ERROR,
   MAINTENANCES_LOADED,
   MAINTENANCE_CLEARED,
   MAINTENANCE_DELETED,
   MAINTENANCE_LOADED,
   MAINTENANCE_REGISTERED,
   MAINTENANCE_UPDATED,
   NEWJOBNUMBER_LOADED,
   REMOVEMAINTENANCE_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingMaintenance: true,
   maintenance: null,
   maintenances: [],
   otherData: {
      newJobNumber: "",
   },
   error: {},
};

const maintenanceReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case MAINTENANCE_LOADED:
         return {
            ...state,
            loadingMaintenance: false,
            maintenance: payload,
            error: {},
         };
      case MAINTENANCES_LOADED:
         return {
            ...state,
            loading: false,
            maintenances: payload,
            error: {},
         };
      case MAINTENANCE_REGISTERED:
         return {
            ...state,
            loading: false,
            maintenances: [...state.maintenances, payload],
            error: {},
         };
      case MAINTENANCE_UPDATED:
         return {
            ...state,
            loading: false,
            maintenance: payload,
            loadingMaintenance: false,
            maintenances: state.maintenances.map((item) =>
               item._id !== payload._id ? item : payload
            ),
            error: {},
         };
      case MAINTENANCE_DELETED:
         return {
            ...state,
            maintenances: state.maintenances.filter(
               (item) => item._id !== payload
            ),
            loading: false,
            error: {},
         };
      case NEWJOBNUMBER_LOADED:
         return {
            ...state,
            otherData: {
               ...state.otherData,
               newJobNumber: payload,
            },
         };
      case MAINTENANCES_CLEARED:
         return initialState;
      case MAINTENANCE_CLEARED:
         return {
            ...state,
            maintenance: null,
            loadingMaintenance: true,
            otherData: {
               ...state.otherData,
               newJobNumber: "",
            },
         };
      case MAINTENANCES_ERROR:
         return {
            ...state,
            maintenance: null,
            maintenances: [],
            loading: false,
            loadingMaintenance: false,
            otherData: {
               newJobNumber: "",
            },
            error: payload,
         };
      case REMOVEMAINTENANCE_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      default:
         return state;
   }
};

export default maintenanceReducer;
