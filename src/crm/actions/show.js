import {ENTITIES} from "../../constants";


export const SHOW_ADD_NEW_OBJECT = "SHOW_ADD_NEW_OBJECT";
export const SHOW_SET_CURRENT = "SHOW_SET_CURRENT";
export const SHOW_ADD = "SHOW_ADD";
export const SHOW_REMOVE = "SHOW_REMOVE";

export const setCurrent = (showId) => dispatch => {
  dispatch({ type: SHOW_SET_CURRENT, payload: { entityId: ENTITIES.show, showId }});
};
