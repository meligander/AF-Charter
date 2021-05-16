import { combineReducers } from "redux";

import users from "./user";
import vessels from "./vessel";
import auth from "./auth";
import alert from "./alert";

export default combineReducers({
   alert,
   auth,
   users,
   vessels,
});
