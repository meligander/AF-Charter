import { combineReducers } from "redux";

import users from "./user";
import vessels from "./vessel";
import auth from "./auth";

export default combineReducers({
   auth,
   users,
   vessels,
});
