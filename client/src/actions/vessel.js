import api from "../utils/api";
import history from "../utils/history";

import {
   VESSEL_LOADED,
   VESSELS_LOADED,
   VESSEL_REGISTERED,
   VESSEL_UPDATED,
   VESSELS_CLEARED,
   VESSEL_CLEARED,
   VESSELS_ERROR,
   VESSEL_DELETED,
   VESSEL_ERROR,
   REMOVEVESSEL_ERROR,
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { deleteUnpaidReservation } from "./reservation";

export const loadVessel = (vessel_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      dispatch(deleteUnpaidReservation());

      const res = await api.get(`/vessel/${vessel_id}`);
      dispatch({
         type: VESSEL_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: VESSELS_ERROR,
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

export const loadVessels = (filterData) => async (dispatch) => {
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
      const res = await api.get(`/vessel?${filter}`);

      dispatch({
         type: VESSELS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: VESSELS_ERROR,
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

export const checkAvailableVessels =
   (dateFrom, dateTo, reservation_id) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.get(
            `/vessel/${dateFrom}/${dateTo}/${reservation_id}`
         );

         dispatch({
            type: VESSELS_LOADED,
            payload: res.data,
         });
      } catch (err) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: VESSELS_ERROR,
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

export const registerUpdateVessel =
   (formData, vessel_id) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      const name = formData.name
         ? formData.name.toLowerCase().replace(/\s/g, "-")
         : undefined;

      try {
         if (formData.formImg)
            await api.post(
               `/vessel/upload-mainimg/${vessel_id}/${name}`,
               formData.formImg
            );

         let res;

         if (vessel_id) {
            res = await api.post(`/vessel/${vessel_id}`, formData);
         } else {
            res = await api.post("/vessel/0", formData);
         }

         dispatch({
            type: vessel_id ? VESSEL_UPDATED : VESSEL_REGISTERED,
            payload: res.data,
         });

         history.push("/vessels-list");
         dispatch(
            setAlert(
               `Vessel ${vessel_id ? "Updated" : "Created"}`,
               "success",
               "2"
            )
         );
      } catch (err) {
         if (err.response.data.errors) {
            const errors = err.response.data.errors;
            errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
            dispatch({
               type: VESSEL_ERROR,
               payload: errors,
            });
         } else {
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
            dispatch({
               type: VESSEL_ERROR,
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

export const deleteVessel = (vessel_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/vessel/${vessel_id}`);

      dispatch({
         type: VESSEL_DELETED,
         payload: vessel_id,
      });

      dispatch(setAlert("Vessel Deleted", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: VESSEL_ERROR,
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

export const deleteImage = (vessel_id, image) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.put(`/vessel/delete-image/${vessel_id}`, image);

      dispatch({
         type: VESSEL_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Image Deleted", "success", "2"));
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const removeVesselError = (param) => (dispatch) => {
   dispatch({
      type: REMOVEVESSEL_ERROR,
      payload: param,
   });
};

export const clearVessels = () => (dispatch) => {
   dispatch({ type: VESSELS_CLEARED });
};

export const clearVessel = () => (dispatch) => {
   dispatch({ type: VESSEL_CLEARED });
};
