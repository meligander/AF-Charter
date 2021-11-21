import {
   USER_LOADED,
   USERS_LOADED,
   USER_REGISTERED,
   USER_UPDATED,
   USER_DELETED,
   USERS_CLEARED,
   USERS_ERROR,
   REMOVEUSER_ERROR,
   USERSSECONDARY_ERROR,
   USERSSECONDARY_LOADED,
   USER_CLEARED,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingUser: true,
   user: null,
   users: [],
   usersAux: [],
   loadingAux: true,
   error: {},
};

const userReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case USER_LOADED:
         return {
            ...state,
            loadingUser: false,
            user: payload,
            error: {},
         };
      case USERS_LOADED:
         return {
            ...state,
            loading: false,
            users: payload,
            error: {},
         };
      case USERSSECONDARY_LOADED:
         return {
            ...state,
            loadingAux: false,
            usersAux: payload,
            error: {},
         };
      case USER_REGISTERED:
      case USER_UPDATED:
         return {
            ...state,
            loading: false,
            users: [...state.users, payload],
            error: {},
         };
      case USER_DELETED:
         return {
            ...state,
            users: state.users.filter((user) => user._id !== payload),
            loading: false,
            error: {},
         };
      case USERS_CLEARED:
         return initialState;
      case USER_CLEARED:
         return {
            ...state,
            user: null,
            loadingUser: true,
            error: {},
         };
      case USERS_ERROR:
         return {
            ...state,
            user: null,
            users: [],
            loadingUser: false,
            loading: false,
            error: payload,
         };
      case USERSSECONDARY_ERROR:
         return {
            ...state,
            usersAux: [],
            loadingAux: false,
            error: payload,
         };
      case REMOVEUSER_ERROR:
         return {
            ...state,
            error: state.error.filter((errorI) => errorI.param !== payload),
         };
      default:
         return state;
   }
};

export default userReducer;
