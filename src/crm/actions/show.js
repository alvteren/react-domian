import { ENTITIES } from "../../constants";

export const SHOW_ADD_NEW_OBJECT = "SHOW_ADD_NEW_OBJECT";
export const SHOW_SET_CURRENT = "SHOW_SET_CURRENT";
export const SHOW_ADD = "SHOW_ADD";
export const SHOW_REMOVE = "SHOW_REMOVE";

export const setCurrent = props => dispatch => {
  const { showId, location } = props;

  dispatch({
    type: SHOW_SET_CURRENT,
    payload: { entityId: ENTITIES.show, showId, location }
  });
};
export const addObject = props => dispatch => {
  const { showId } = props;

  dispatch({
    type: SHOW_ADD_NEW_OBJECT,
    payload: { entityId: ENTITIES.show, showId }
  });
};
