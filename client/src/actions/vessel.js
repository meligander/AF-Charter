import api from "../utils/api";

import {
   VESSEL_LOADED,
   VESSELS_LOADED,
   VESSEL_REGISTERED,
   VESSEL_UPDATED,
   VESSELS_CLEARED,
   VESSELS_ERROR,
} from "./types";

export const loadVessel = (vessel_id) => async (dispatch) => {
   try {
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
   }
};

export const loadVessels = (filterData) => async (dispatch) => {
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
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: VESSELS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      //dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scrollTo(0, 0);
   }
};

export const registerUpdateVessel = (formData, vessel_id) => async (
   dispatch
) => {
   try {
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
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            //dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: VESSELS_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: VESSELS_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         //dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   window.scrollTo(0, 0);
};

export const clearVessels = () => (dispatch) => {
   dispatch({ type: VESSELS_CLEARED });
};
