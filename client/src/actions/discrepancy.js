import api from "../utils/api";

import {
   DISCREPANCIES_CLEARED,
   DISCREPANCIES_ERROR,
   DISCREPANCIES_LOADED,
   DISCREPANCIES_UPDATED,
   DISCREPANCY_DELETED,
   REMOVEDISCREPANCY_ERROR,
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const loadDiscrepancies = (reservation_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get(`/discrepancy/${reservation_id}`);

      dispatch({
         type: DISCREPANCIES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: DISCREPANCIES_ERROR,
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

export const saveDiscrepancy =
   (discrepancy, reservation) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.post(
            `/discrepancy/${reservation._id}/${reservation.vessel._id}`,
            discrepancy
         );

         dispatch({
            type: DISCREPANCIES_UPDATED,
            payload: res.data,
         });

         dispatch(setAlert("Discrepancy Saved", "success", "2"));
      } catch (err) {
         if (err.response.data.errors) {
            const errors = err.response.data.errors;
            errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
            dispatch({
               type: DISCREPANCIES_ERROR,
               payload: errors,
            });
         } else {
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
            dispatch({
               type: DISCREPANCIES_ERROR,
               payload: {
                  type: err.response.statusText,
                  status: err.response.status,
                  msg: err.response.data.msg,
               },
            });
         }
      }

      dispatch(updateLoadingSpinner(false));
   };

export const deleteDiscrepancy = (discrepancy_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/discrepancy/${discrepancy_id}`);

      dispatch({
         type: DISCREPANCY_DELETED,
         payload: discrepancy_id,
      });

      dispatch(setAlert("Discrepancy Deleted", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: DISCREPANCIES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }

   dispatch(updateLoadingSpinner(false));
};

export const removeDiscrepancyError = (param) => (dispatch) => {
   dispatch({
      type: REMOVEDISCREPANCY_ERROR,
      payload: param,
   });
};

export const clearDiscrepancies = () => (dispatch) => {
   dispatch({ type: DISCREPANCIES_CLEARED });
};
