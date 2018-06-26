import { ENTITIES } from "../../constants";
import { VALIDATE_FORM_SUBMIT } from "../actions/validate";
import * as validateActions from "./validate";

export const SHOW_ADD_NEW_OBJECT = "SHOW_ADD_NEW_OBJECT";
export const SHOW_SET_CURRENT = "SHOW_SET_CURRENT";
export const SHOW_ADD = "SHOW_ADD";
export const SHOW_REMOVE = "SHOW_REMOVE";
export const SHOW_SET_EDITED = "SHOW_SET_EDITED";
export const SHOW_ADD_ERROR = "SHOW_ADD_ERROR";

export const setCurrent = props => dispatch => {
  const { elementId, location } = props;

  dispatch({
    type: SHOW_SET_CURRENT,
    payload: { entityId: ENTITIES.show, elementId, location }
  });
};
export const addObject = props => dispatch => {
  const { elementId } = props;

  dispatch({
    type: SHOW_ADD_NEW_OBJECT,
    payload: { entityId: ENTITIES.show, elementId }
  });
};

export const setEdited = props => dispatch => {
  const { elementId } = props;

  dispatch({
    type: SHOW_SET_EDITED,
    payload: { entityId: ENTITIES.show, elementId }
  })
};

export const saveShow = props => dispatch => {
  const { entityId, elementId } = props;

  try {
    dispatch({ type: VALIDATE_FORM_SUBMIT, payload: { entityId, ...props } });
  } catch (err) {
    dispatch({ type: err.action || SHOW_ADD_ERROR, payload: { entityId, elementId, ...err}, error: true });
  }

  console.log("SAVE", elementId);
};
