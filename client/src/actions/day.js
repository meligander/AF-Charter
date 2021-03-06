import api from "../utils/api";

import {
   DAYAVAILABILITY_LOADED,
   MONTHAVAILABILITY_LOADED,
   DAY_DISABLED,
   DAY_ENABLED,
   DAYSAVAILABILITY_ERROR,
   DAYSAVAILABILITY_CLEARED,
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const checkDayAvailability =
   (vessel_id, date, time, from, to) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      try {
         const res = await api.get(
            `/day/${vessel_id}/${date}/${time ? time : "0"}/${
               from ? from : "0"
            }/${to ? to : "0"}`
         );
         dispatch({
            type: DAYAVAILABILITY_LOADED,
            payload: res.data,
         });
      } catch (err) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: DAYSAVAILABILITY_ERROR,
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

export const checkMonthAvailability =
   (vessel_id, month, year, time, date, loadByItself) => async (dispatch) => {
      if (loadByItself) dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.get(
            `/day/month/${vessel_id}/${month}/${year}/${time ? time : "0"}/${
               date ? date : "0"
            }`
         );

         dispatch({
            type: MONTHAVAILABILITY_LOADED,
            payload: res.data,
         });
      } catch (err) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: DAYSAVAILABILITY_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
         window.scrollTo(0, 0);
      }

      if (loadByItself) dispatch(updateLoadingSpinner(false));
   };

export const disableDate = (vessel_id, date) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.post(`/day/${vessel_id}/${date}`);

      dispatch({
         type: DAY_DISABLED,
         payload: res.data,
      });

      dispatch(setAlert("Date successfully disabled", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: DAYSAVAILABILITY_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const enableDate = (vessel_id, date) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.delete(`/day/${vessel_id}/${date}`);

      dispatch({
         type: DAY_ENABLED,
         payload: res.data,
      });

      dispatch(setAlert("Date successfully enabled", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: DAYSAVAILABILITY_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearDaysAvailability = () => (dispatch) => {
   dispatch({ type: DAYSAVAILABILITY_CLEARED });
};
