import {
   USERAUTH_LOADED,
   AUTH_ERROR,
   LOGIN_FAIL,
   LOGIN_SUCCESS,
   LOGOUT,
   SIGNUP_FAIL,
   EMAILAUTH_SENT,
   REMOVEAUTH_ERROR,
   SIGNUP_SUCCESS,
   PASSWORD_CHANGED,
   EMAIL_ERROR,
} from "../actions/types";

const initialState = {
   token: localStorage.getItem("token"),
   loggedUser: null,
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
            loggedUser: payload,
            isAuthenticated: true,
         };
      case SIGNUP_SUCCESS:
         return {
            ...state,
            loading: false,
            loggedUser: payload.user,
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
         return {
            ...state,
            token: null,
            isAuthenticated: false,
            loggedUser: null,
            loading: false,
            error: payload ? payload : "",
         };
      case PASSWORD_CHANGED:
         return {
            ...state,
            token: payload.token,
            loading: false,
            loggedUser: payload.user,
            isAuthenticated: true,
         };
      case EMAIL_ERROR:
      case SIGNUP_FAIL:
      case LOGIN_FAIL:
         return {
            ...state,
            error: payload,
            loading: false,
            token: null,
            isAuthenticated: false,
            loggedUser: null,
         };
      case EMAILAUTH_SENT:
         return {
            ...state,
            emailSent: true,
            error: "",
         };
      case REMOVEAUTH_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      case LOGOUT:
         return {
            ...state,
            token: null,
            isAuthenticated: false,
            loggedUser: null,
            loading: true,
            error: "",
         };
      default:
         return state;
   }
};

export default authReducer;
