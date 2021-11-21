import {
   DAILYPAYMENTS_LOADED,
   MONTHLYPAYMENTS_LOADED,
   PAYMENTS_CLEARED,
   PAYMENTS_ERROR,
   PAYMENTS_LOADED,
   WEEKLYPAYMENTS_LOADED,
} from "../actions/types";

const initialState = {
   loading: true,
   payments: [],
   otherData: {
      dailyPayments: "",
      weeklyPayments: "",
      monthlyPayments: "",
   },
   error: {},
};

const paymentReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case PAYMENTS_LOADED:
         return {
            ...state,
            loading: false,
            payments: payload,
            error: {},
         };
      case DAILYPAYMENTS_LOADED:
         return {
            ...state,
            otherData: {
               ...state.otherData,
               dailyPayments: payload,
            },
         };
      case WEEKLYPAYMENTS_LOADED:
         return {
            ...state,
            otherData: {
               ...state.otherData,
               weeklyPayments: payload,
            },
         };
      case MONTHLYPAYMENTS_LOADED:
         return {
            ...state,
            otherData: {
               ...state.otherData,
               monthlyPayments: payload,
            },
         };
      case PAYMENTS_CLEARED:
         return initialState;
      case PAYMENTS_ERROR:
         return {
            ...state,
            payments: [],
            loading: false,
            otherData: {
               dailyPayments: "",
               weeklyPayments: "",
               monthlyPayments: "",
            },
            error: payload,
         };
      default:
         return state;
   }
};

export default paymentReducer;
