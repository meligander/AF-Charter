import api from "../utils/api";
import history from "../utils/history";

import {
   RESERVATIONS_CLEARED,
   RESERVATIONS_ERROR,
   RESERVATIONS_LOADED,
   RESERVATION_DELETED,
   UNPAIDRESERVATIONS_DELETED,
   RESERVATION_LOADED,
   RESERVATION_REGISTERED,
   RESERVATION_UPDATED,
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const loadReservation = (reservation_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get(`/reservation/${reservation_id}`);
      dispatch({
         type: RESERVATION_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: RESERVATIONS_ERROR,
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

export const loadReservations = (filterData) => async (dispatch) => {
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
      dispatch(deleteUnpaidReservation());

      const res = await api.get(`/reservation?${filter}`);

      dispatch({
         type: RESERVATIONS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: RESERVATIONS_ERROR,
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

export const registerReservation = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   if (!formData.customer) {
      history.push("/login");
      dispatch(
         setAlert(
            "You must login or signup before making a reservation",
            "success",
            "2"
         )
      );
   } else {
      try {
         let res = await api.post("/reservation", formData);

         dispatch({
            type: RESERVATION_REGISTERED,
            payload: res.data,
         });

         history.push(`/payment/${res.data._id}`);
         window.scrollTo(0, 0);
      } catch (err) {
         if (err.response.data.errors) {
            const errors = err.response.data.errors;
            errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "3"));
            });
            dispatch({
               type: RESERVATIONS_ERROR,
               payload: errors,
            });
         } else {
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
            dispatch({
               type: RESERVATIONS_ERROR,
               payload: {
                  type: err.response.statusText,
                  status: err.response.status,
                  msg: err.response.data.msg,
               },
            });
         }
      }
   }

   dispatch(updateLoadingSpinner(false));
};

export const updateReservation =
   (formData, reservation_id) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      try {
         let res = await api.put(`/reservation/${reservation_id}`, formData);

         dispatch({
            type: RESERVATION_UPDATED,
            payload: res.data,
         });
      } catch (err) {
         if (err.response.data.errors) {
            const errors = err.response.data.errors;
            errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "3"));
            });
            dispatch({
               type: RESERVATIONS_ERROR,
               payload: errors,
            });
         } else {
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
            dispatch({
               type: RESERVATIONS_ERROR,
               payload: {
                  type: err.response.statusText,
                  status: err.response.status,
                  msg: err.response.data.msg,
               },
            });
         }
      }

      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   };

export const cancelDeleteReservation = (reservation) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      if (reservation.payment.downpayment.payStripe) {
         await api.put(`/reservation/cancel/${reservation._id}`);
         await api.put(`/payment/cancel/${reservation.payment._id}`);
      } else await api.delete(`/reservation/${reservation._id}`);

      dispatch({
         type: RESERVATION_DELETED,
         payload: reservation._id,
      });

      dispatch(setAlert("Reservation Deleted", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: RESERVATIONS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const deleteUnpaidReservation = () => async (dispatch) => {
   try {
      await api.delete("/reservation/");

      dispatch({
         type: UNPAIDRESERVATIONS_DELETED,
      });
   } catch (err) {
      dispatch({
         type: RESERVATIONS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const clearReservations = () => (dispatch) => {
   dispatch({ type: RESERVATIONS_CLEARED });
};
