import { combineReducers } from "redux";

import users from "./user";
import vessels from "./vessel";
import auth from "./auth";
import alert from "./alert";
import mixvalues from "./mixvalues";
import reservations from "./reservation";
import days from "./day";

export default combineReducers({
   alert,
   auth,
   days,
   mixvalues,
   reservations,
   users,
   vessels,
});
