import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import filterObjects from "./filter";

export default combineReducers({
  filterObjects,
  routing: routerReducer
});
