import { combineReducers } from "redux";

import filterObjects from "./filter";
import data from "./data";

export const reducers = combineReducers({
  filterObjects,
  data
});
