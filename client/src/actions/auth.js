import api from "../utils/api";

import {
   AUTH_ERROR,
   LOGIN_FAIL,
   LOGIN_SUCCESS,
   LOGOUT,
   EMAILAUTH_SENT,
   USERAUTH_LOADED,
   SIGNUP_FAIL,
   SIGNUP_SUCCESS,
   REMOVE_ERROR,
} from "./types";

import { setAlert } from "./alert";

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
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: LOGIN_FAIL,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
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

export const facebookLogin = (fbkData) => async (dispatch) => {
   try {
      const res = await api.post("/auth/facebooklogin", fbkData);

      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser());
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: LOGIN_FAIL,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });

      window.scrollTo(0, 0);
   }
};

export const googleLogin = (googleData) => async (dispatch) => {
   try {
      const res = await api.post("/auth/googlelogin", googleData);

      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser());
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: LOGIN_FAIL,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });

      window.scrollTo(0, 0);
   }
};

export const signup = (formData) => async (dispatch) => {
   try {
      if (formData.formImg)
         await api.post("/user/upload-img", formData.formImg);

      await api.post("/auth/signup", formData);

      dispatch({
         type: EMAILAUTH_SENT,
      });
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: SIGNUP_FAIL,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: SIGNUP_FAIL,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }

      window.scrollTo(0, 0);
   }
};

export const activation = (token) => async (dispatch) => {
   try {
      const res = await api.post("/auth/activation", { token });

      dispatch({
         type: SIGNUP_SUCCESS,
         payload: res.data,
      });
   } catch (err) {
      console.log(err);
      dispatch({
         type: SIGNUP_FAIL,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });

      window.scrollTo(0, 0);
   }
};

export const removeError = (param) => (dispatch) => {
   dispatch({
      type: REMOVE_ERROR,
      payload: param,
   });
};

export const logOut = () => (dispatch) => {
   dispatch({
      type: LOGOUT,
   });
};
