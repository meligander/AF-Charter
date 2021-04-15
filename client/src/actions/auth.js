import api from "../utils/api";

import {
   AUTH_ERROR,
   LOGIN_FAIL,
   LOGIN_SUCCESS,
   LOGOUT,
   USERAUTH_LOADED,
} from "./types";

export const loadUser = () => async (dispatch) => {
   try {
      const res = await api.get("/auth");
      dispatch({
         type: USERAUTH_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: AUTH_ERROR,
      });
   }
};

export const loginUser = (formData) => async (dispatch) => {
   let user = {};

   for (const prop in formData) {
      if (formData[prop] !== "") user[prop] = formData[prop];
   }

   try {
      const res = await api.post("/auth", user);
      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser());
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            //dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: LOGIN_FAIL,
            payload: errors,
         });
      } else {
         //dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: LOGIN_FAIL,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }

      window.scrollTo(0, 0);
   }
};

export const logOut = () => (dispatch) => {
   dispatch({
      type: LOGOUT,
   });
};
