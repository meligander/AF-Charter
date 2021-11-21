import api from "../utils/api";
import history from "../utils/history";

import {
   USERS_CLEARED,
   USERAUTH_LOADED,
   USERS_ERROR,
   USERS_LOADED,
   USER_LOADED,
   USER_REGISTERED,
   REMOVEUSER_ERROR,
   USER_UPDATED,
   USERSSECONDARY_LOADED,
   USERSSECONDARY_ERROR,
   USER_DELETED,
   USER_CLEARED,
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

export const loadUsers = (filterData, primary, search) => async (dispatch) => {
   if (primary) dispatch(updateLoadingSpinner(true));

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
         type: primary ? USERS_LOADED : USERSSECONDARY_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (!search) dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: primary ? USERS_ERROR : USERSSECONDARY_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   if (primary) dispatch(updateLoadingSpinner(false));
};

export const checkAvailableCaptains =
   (dateFrom, dateTo, reservation_id) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));

      try {
         const res = await api.get(
            `/user/${dateFrom}/${dateTo}/${
               reservation_id ? reservation_id : "0"
            }`
         );

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

export const registerUpdateUser =
   (formData, user_id, self, isAdmin) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      try {
         if (formData.formImg)
            await api.post("/user/upload-img", formData.formImg);

         const res = await api.put(
            `/user/${user_id ? user_id : "0"}`,
            formData
         );

         dispatch({
            type: self
               ? USERAUTH_LOADED
               : user_id
               ? USER_UPDATED
               : USER_REGISTERED,
            payload: res.data,
         });

         dispatch(
            setAlert(
               `${self ? "Profile" : "User"} Successfully ${
                  user_id ? "Updated" : "Registered"
               }`,
               "success",
               "2"
            )
         );
         if (isAdmin && !self) history.push("/users-list");
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

export const deleteUser = (user_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/user/${user_id}`);

      dispatch({
         type: USER_DELETED,
         payload: user_id,
      });

      dispatch(setAlert("User Deleted", "success", "2"));
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

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const removeUserError = (param) => (dispatch) => {
   dispatch({
      type: REMOVEUSER_ERROR,
      payload: param,
   });
};

export const clearUser = () => (dispatch) => {
   dispatch({ type: USER_CLEARED });
};

export const clearUsers = () => (dispatch) => {
   dispatch({ type: USERS_CLEARED });
};
