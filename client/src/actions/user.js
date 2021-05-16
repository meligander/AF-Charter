import api from "../utils/api";

import {
   USERS_CLEARED,
   USERS_ERROR,
   USERS_LOADED,
   USER_LOADED,
   USER_REGISTERED,
   USER_UPDATED,
} from "./types";

import { setAlert } from "./alert";

export const loadUser = (user_id) => async (dispatch) => {
   try {
      const res = await api.get(`/user/${user_id}`);
      dispatch({
         type: USER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: USERS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadUsers = (filterData) => async (dispatch) => {
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
      const res = await api.get(`/user?${filter}`);

      dispatch({
         type: USERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: USERS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scrollTo(0, 0);
   }
};

export const registerUpdateUser = (formData, user_id) => async (dispatch) => {
   try {
      let res;

      if (formData.formImg)
         await api.post("/user/upload-img", formData.formImg);

      if (user_id) {
         res = await api.put(`/user/${user_id}`, formData);
      } else {
         res = await api.post("/user", formData);
      }

      dispatch({
         type: user_id ? USER_UPDATED : USER_REGISTERED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            //dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: USERS_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: USERS_ERROR,
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
   dispatch({ type: USERS_CLEARED });
};
