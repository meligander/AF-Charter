import api from "../utils/api";
import history from "../utils/history";

import { PAYMENT_REGISTERED, PAYMENT_CANCELED, PAYMENT_ERROR } from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const makeStripePayment =
   (formData, payment_id, type) => async (dispatch) => {
      try {
         const res = await api.put(`/payment/${payment_id}`, formData);
         dispatch({
            type: PAYMENT_REGISTERED,
            payload: res.data,
         });
         if (type === "customer") history.push("/myreservations");
         dispatch(
            setAlert(
               "Payment Registered",
               "success",
               type === "customer" ? "2" : "3"
            )
         );
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

export const makeCashPayment = (formData, payment_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/cash/${payment_id}`, formData);
      dispatch({
         type: PAYMENT_REGISTERED,
         payload: res.data,
      });
      dispatch(setAlert("Payment Registered", "success", "3"));
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

export const cancelPayment = (payment_id, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/cancel/${payment_id}/${type}`);
      dispatch({
         type: PAYMENT_CANCELED,
         payload: res.data,
      });
      dispatch(setAlert("Payment Canceled", "danger", "3"));
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
