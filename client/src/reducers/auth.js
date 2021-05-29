import {
   USERAUTH_LOADED,
   AUTH_ERROR,
   LOGIN_FAIL,
   LOGIN_SUCCESS,
   LOGOUT,
   SIGNUP_FAIL,
   EMAILAUTH_SENT,
   REMOVE_ERROR,
   SIGNUP_SUCCESS,
   PASSWORD_CHANGED,
} from "../actions/types";

const initialState = {
   token: localStorage.getItem("token"),
   userLogged: null,
   loading: true,
   isAuthenticated: false,
   error: "",
   emailSent: false,
};

const authReducer = (state = initialState, action) => {
   const { type, payload } = action;

   switch (type) {
      case USERAUTH_LOADED:
         return {
            ...state,
            loading: false,
            userLogged: payload,
            isAuthenticated: true,
         };
      case SIGNUP_SUCCESS:
         return {
            ...state,
            loading: false,
            userLogged: payload.user,
            isAuthenticated: true,
            token: payload.token,
         };
      case LOGIN_SUCCESS:
         return {
            ...state,
            loading: false,
            token: payload.token,
         };
      case AUTH_ERROR:
      case LOGOUT:
         return {
            ...state,
            token: null,
            isAuthenticated: false,
            userLogged: null,
            loading: false,
            error: payload ? payload : "",
         };
      case PASSWORD_CHANGED:
         return {
            ...state,
            token: payload.token,
            loading: false,
            userLogged: payload.user,
            isAuthenticated: true,
         };
      case SIGNUP_FAIL:
      case LOGIN_FAIL:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      case EMAILAUTH_SENT:
         return {
            ...state,
            emailSent: true,
            error: "",
         };
      case REMOVE_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      default:
         return state;
   }
};

export default authReducer;
