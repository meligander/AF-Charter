import api from "../utils/api";
import history from "../utils/history";

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
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const getNewJobNumber = (vessel_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get(`/maintenance/job-number/${vessel_id}`);

      dispatch({
         type: NEWJOBNUMBER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: MAINTENANCES_ERROR,
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

export const loadMaintenance = (maintenance_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get(`/maintenance/${maintenance_id}`);

      dispatch({
         type: MAINTENANCE_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: MAINTENANCES_ERROR,
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

export const loadMaintenances = (filterData, bulkLoad) => async (dispatch) => {
   if (!bulkLoad) dispatch(updateLoadingSpinner(true));

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
      const res = await api.get(`/maintenance?${filter}`);

      dispatch({
         type: MAINTENANCES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: MAINTENANCES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   if (!bulkLoad) dispatch(updateLoadingSpinner(false));
};

export const registerUpdateMaintenance =
   (formData, maintenance_id) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.put(
            `/maintenance/${maintenance_id ? maintenance_id : "0"}`,
            formData
         );

         dispatch({
            type: maintenance_id ? MAINTENANCE_UPDATED : MAINTENANCE_REGISTERED,
            payload: res.data,
         });

         dispatch(
            setAlert(
               `Maintenance ${maintenance_id ? "Updated" : "Registered"}`,
               "success",
               "2"
            )
         );
         history.push("/maintenance-list");
      } catch (err) {
         if (err.response.data.errors) {
            const errors = err.response.data.errors;
            errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
            dispatch({
               type: MAINTENANCES_ERROR,
               payload: errors,
            });
         } else {
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
            dispatch({
               type: MAINTENANCES_ERROR,
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

export const closeReopenMaintenance =
   (maintenance_id, closeDate) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.put(`/maintenance/close/${maintenance_id}`, {
            closeDate,
         });

         dispatch({
            type: MAINTENANCE_UPDATED,
            payload: res.data,
         });

         dispatch(
            setAlert(
               `Maintenance ${closeDate ? "Closed" : "Reopened"}`,
               "success",
               "2"
            )
         );

         history.push("/maintenance-list");
      } catch (err) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: MAINTENANCES_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   };

export const deleteMaintenance = (maintenance_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/maintenance/${maintenance_id}`);

      dispatch({
         type: MAINTENANCE_DELETED,
         payload: maintenance_id,
      });

      dispatch(setAlert("Maintenance Deleted", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: MAINTENANCES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }

   dispatch(updateLoadingSpinner(false));
};

export const removeMaintenanceError = (param) => (dispatch) => {
   dispatch({
      type: REMOVEMAINTENANCE_ERROR,
      payload: param,
   });
};

export const clearMaintenances = () => (dispatch) => {
   dispatch({ type: MAINTENANCES_CLEARED });
};

export const clearMaintenance = () => (dispatch) => {
   dispatch({ type: MAINTENANCE_CLEARED });
};
