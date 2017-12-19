import { combineReducers } from "redux";

import filterObjects from "./filter";
import wish from "./wish";
import objects from "./objects";

export const reducers = combineReducers({
  filterObjects,
  objects,
  wish
});
