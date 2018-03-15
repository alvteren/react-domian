import { combineReducers } from "redux";

import routing from "./routing";
import photo from "./photo";

export const reducers = combineReducers({
  routing,
  photo
});
