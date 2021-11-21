import api from "../utils/api";
import history from "../utils/history";

import {
   PAYMENT_REGISTERED,
   PAYMENT_CANCELED,
   PAYMENTS_ERROR,
   PAYMENTS_LOADED,
   DAILYPAYMENTS_LOADED,
   WEEKLYPAYMENTS_LOADED,
   MONTHLYPAYMENTS_LOADED,
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearReservations } from "./reservation";

export const loadPayments = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let filter = "";
   const filternames = Object.keys(filterData);
   for (let x = 0; x < filternames.length; x++) {
      const name = filternames[x];
      if (filterData[name] !== "") {
         if (filter !== "") filter = filter + "&";
         filter = filter + filternames[x] + "=" + filterData[name];
      }
   }
   try {
      const res = await api.get(`/payment?${filter}`);

      dispatch({
         type: PAYMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: PAYMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadTotalTime = (time) => async (dispatch) => {
   try {
      const res = await api.get(
         `/payment/${time === "weeks" ? "days" : time}/${
            time === "weeks" ? 7 : 1
         }`
      );

      dispatch({
         type:
            time === "months"
               ? MONTHLYPAYMENTS_LOADED
               : time === "weeks"
               ? WEEKLYPAYMENTS_LOADED
               : DAILYPAYMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: PAYMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }
};

export const makeStripePayment =
   (formData, payment_id, type) => async (dispatch) => {
      try {
         const res = await api.put(`/payment/${payment_id}`, formData);
         dispatch({
            type: PAYMENT_REGISTERED,
            payload: res.data,
         });
         if (type === "customer") history.push("/myreservations");
         else history.push("/reservations-list");
         dispatch(
            setAlert(
               "Payment Registered",
               "success",
               type === "customer" || res.data.payment === "balance" ? "2" : "3"
            )
         );
         if (res.data.payment === "balance" || type === "customer") {
            dispatch(clearReservations());
            window.scrollTo(0, 0);
         }
      } catch (err) {
         dispatch(
            setAlert(
               err.response.data.msg,
               "danger",
               err.response.status === 401 ? "2" : "3"
            )
         );
         dispatch({
            type: PAYMENTS_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
         window.scrollTo(0, 0);
      }

      dispatch(updateLoadingSpinner(false));
   };

export const makeCashPayment = (payment_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/cash/${payment_id}`);
      dispatch({
         type: PAYMENT_REGISTERED,
         payload: res.data,
      });
      dispatch(
         setAlert(
            "Payment Registered",
            "success",
            res.data.payment === "balance" ? "2" : "3"
         )
      );
      if (res.data.payment === "balance") {
         window.scrollTo(0, 0);
         dispatch(clearReservations());
         history.push("/reservations-list");
      }
   } catch (err) {
      dispatch(
         setAlert(
            err.response.data.msg,
            "danger",
            err.response.status === 401 ? "2" : "3"
         )
      );
      dispatch({
         type: PAYMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const cancelPayment = (payment_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/cancel/${payment_id}`);
      dispatch({
         type: PAYMENT_CANCELED,
         payload: res.data,
      });
      dispatch(
         setAlert(
            "Payment Canceled",
            "danger",
            res.data.payment === "balance" ? "2" : "3"
         )
      );
      if (res.data.payment === "balance") {
         window.scrollTo(0, 0);
         dispatch(clearReservations());
         history.push("/reservations-list");
      }
   } catch (err) {
      dispatch(
         setAlert(
            err.response.data.msg,
            "danger",
            err.response.status === 401 ? "2" : "3"
         )
      );
      dispatch({
         type: PAYMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};
