import { ENTITIES } from "../../constants";
import { VALIDATE_FORM_SUBMIT } from "../actions/validate";
import { saveShow as saveShowApi } from "../../api/show";

export const SHOW_ADD_NEW_OBJECT = "SHOW_ADD_NEW_OBJECT";
export const SHOW_SET_CURRENT = "SHOW_SET_CURRENT";
export const SHOW_ADD = "SHOW_ADD";
export const SHOW_REMOVE = "SHOW_REMOVE";
export const SHOW_SET_EDITED = "SHOW_SET_EDITED";
export const SHOW_ADD_ERROR = "SHOW_ADD_ERROR";
export const SHOW_PREPARE_FOR_SAVE = "SHOW_PREPARE_FOR_SAVE";
export const SHOW_EMPTY_ITEMS_SAVE = "SHOW_EMPTY_ITEMS_SAVE";

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

export const setEdited = props => dispatch => {
  const { showId } = props;

  dispatch({
    type: SHOW_SET_EDITED,
    payload: { entityId: ENTITIES.show, showId }
  })
};

export const saveShow = props => dispatch => {
  const { entityId, showId } = props;

  try {
    dispatch({ type: SHOW_PREPARE_FOR_SAVE, payload: { entityId, showId }});
    dispatch({ type: VALIDATE_FORM_SUBMIT, payload: { entityId, elementId: showId, ...props }});
    saveShowApi({ entityId: ENTITIES.lead  });
  } catch (err) {
    console.warn(err);
    dispatch({ type: err.action || SHOW_ADD_ERROR, payload: { entityId, elementId: showId, ...err }, error: true });
  }
};
