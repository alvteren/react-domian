import { combineReducers } from "redux";

import filterObjects from "./filter";
import objects from "./objects";
import form from "./form";
import leads from "./leads";

export const reducers = combineReducers({
  filterObjects,
  objects,
  form,
  leads
});
