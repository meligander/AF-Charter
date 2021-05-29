import api from "../utils/api";
//import history from "../utils/history";

import {
   USERS_CLEARED,
   USERS_ERROR,
   USERS_LOADED,
   USER_LOADED,
   USER_REGISTERED,
   USER_UPDATED,
} from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const loadUser = (user_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get(`/user/${user_id}`);
      dispatch({
         type: USER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: USERS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
   dispatch(updateLoadingSpinner(false));
};

export const loadUsers = (filterData) => async (dispatch) => {
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
      const res = await api.get(`/user?${filter}`);

      dispatch({
         type: USERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: USERS_ERROR,
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

export const checkAvailableCaptains =
   (dateFrom, dateTo) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.get(`/user/${dateFrom}/${dateTo}`);

         dispatch({
            type: USERS_LOADED,
            payload: res.data,
         });
      } catch (err) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: USERS_ERROR,
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

export const registerUpdateUser = (formData, user_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let res;

      if (formData.formImg)
         await api.post("/user/upload-img", formData.formImg);

      if (user_id) {
         res = await api.post(`/user/${user_id}`, formData);
      } else {
         res = await api.post("/user/0", formData);
      }

      dispatch({
         type: user_id ? USER_UPDATED : USER_REGISTERED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: USERS_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: USERS_ERROR,
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

export const clearUsers = () => (dispatch) => {
   dispatch({ type: USERS_CLEARED });
};
