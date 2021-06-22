import api from "../utils/api";
import history from "../utils/history";

import { PAYMENT_REGISTERED, PAYMENT_CANCELED, PAYMENT_ERROR } from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearReservations } from "./reservation";

export const makeStripePayment =
   (formData, payment_id, type, payType) => async (dispatch) => {
      try {
         const res = await api.put(`/payment/${payment_id}`, formData);
         dispatch({
            type: PAYMENT_REGISTERED,
            payload: { data: res.data, payType },
         });
         if (type === "customer") history.push("/myreservations");
         else history.push("/reservations-list");
         dispatch(
            setAlert(
               "Payment Registered",
               "success",
               type === "customer" || payType === "balance" ? "2" : "3"
            )
         );
         if (payType === "balance") {
            window.scrollTo(0, 0);
            dispatch(clearReservations());
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
            type: PAYMENT_ERROR,
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

export const makeCashPayment = (payment_id, payType) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/cash/${payment_id}`);
      dispatch({
         type: PAYMENT_REGISTERED,
         payload: { data: res.data, payType },
      });
      dispatch(
         setAlert(
            "Payment Registered",
            "success",
            payType === "balance" ? "2" : "3"
         )
      );
      if (payType === "balance") {
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
         type: PAYMENT_ERROR,
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

export const cancelPayment = (payment_id, payType) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/cancel/${payment_id}`);
      dispatch({
         type: PAYMENT_CANCELED,
         payload: { data: res.data, payType },
      });
      dispatch(
         setAlert(
            "Payment Canceled",
            "danger",
            payType === "balance" ? "2" : "3"
         )
      );
      if (payType === "balance") {
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
         type: PAYMENT_ERROR,
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
