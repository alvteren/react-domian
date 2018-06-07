import { combineReducers } from "redux";

import filterObjects from "./filter";
import sale from "./sale";
import form from "./form";
import lead from "./lead";
import reminder from "./reminder";
import show from "./show";

export const reducers = combineReducers({
  filterObjects,
  sale,
  form,
  lead,
  reminder,
  show
});
