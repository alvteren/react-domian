import { combineReducers } from "redux";

import filterObjects from "./filter";
import wish from "./wish";
import objects from "./objects";
import form from "./form";

export const reducers = combineReducers({
  filterObjects,
  objects,
  form,
  wish
});
