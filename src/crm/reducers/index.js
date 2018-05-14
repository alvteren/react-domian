import { combineReducers } from "redux";

import filterObjects from "./filter";
import objects from "./objects";
import form from "./form";
import lead from "./leads";

export const reducers = combineReducers({
  filterObjects,
  objects,
  form,
  lead
});
