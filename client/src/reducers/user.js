import {
   USER_LOADED,
   USERS_LOADED,
   USER_REGISTERED,
   USER_UPDATED,
   USER_DELETED,
   USERS_CLEARED,
   USERS_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   user: null,
   users: [],
   error: {},
};

const userReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case USER_LOADED:
         return {
            ...state,
            loading: false,
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
      case USER_REGISTERED:
      case USER_UPDATED:
         return {
            ...state,
            loading: false,
            user: payload,
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
      case USERS_ERROR:
         return {
            ...state,
            vessel: null,
            vessels: [],
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
};

export default userReducer;
