import { combineReducers } from "redux";

import routing from "./routing";
import photo from "./photo";
import routeapp from "./routeapp";
import tools from "./tools";

export const reducers = combineReducers({
  routing,
  routeapp,
  tools,
  photo
});
