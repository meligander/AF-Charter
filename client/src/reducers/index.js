import { combineReducers } from "redux";

import users from "./user";
import vessels from "./vessel";
import auth from "./auth";
import alert from "./alert";
import mixvalues from "./mixvalues";
import reservations from "./reservation";
import days from "./day";
import discrepancies from "./discrepancy";

export default combineReducers({
   alert,
   auth,
   days,
   discrepancies,
   mixvalues,
   reservations,
   users,
   vessels,
});
