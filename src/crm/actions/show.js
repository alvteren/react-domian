import { ENTITIES } from "../../constants";
import { VALIDATE_FORM_SUBMIT } from "../actions/validate";
import { saveShow as saveShowApi } from "../../api/show";
import { showRules } from "../reducers/show";
import { omit, get, cloneDeep } from "lodash";

export const SHOW_ADD_NEW_OBJECT = "SHOW_ADD_NEW_OBJECT";
export const SHOW_SET_CURRENT = "SHOW_SET_CURRENT";
export const SHOW_SET_EDITED = "SHOW_SET_EDITED";
export const SHOW_ADD_ERROR = "SHOW_ADD_ERROR";
export const SHOW_PREPARE_FOR_VALIDATE = "SHOW_PREPARE_FOR_VALIDATE";
export const SHOW_EMPTY_ITEMS_SAVE = "SHOW_EMPTY_ITEMS_SAVE";
export const SHOW_SET_NEW = "SHOW_SET_NEW";

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

export const saveShow = props => async dispatch => {
  const { entityId, elementId, showId, show } = props;

  try {
    dispatch({ type: SHOW_PREPARE_FOR_VALIDATE, payload: { entityId, showId }});
    dispatch({ type: VALIDATE_FORM_SUBMIT, payload: { entityId, ...props, elementId: showId }});
    const showForSave = prepareForSave(show);
    const res = await saveShowApi({ entityId: ENTITIES.lead, elementId, showId, show: showForSave });

    if (res.success && showId === 0) {
      const { data } = res;
      // const data = res[0];
      const id = Object.keys(data)[0];
      dispatch({ type: SHOW_SET_NEW, payload: { entityId, elementId, id, show }});
      dispatch({ type: SHOW_SET_NEW, payload: { entityId: ENTITIES.lead, elementId, id, show }});
    }
  } catch (err) {
    console.warn(err);
    dispatch({ type: err.action || SHOW_ADD_ERROR, payload: { entityId, elementId: showId, ...err }, error: true });
  }
};

function prepareForSave(show) {
  return omit(show, showRules.excludeValidationProps);
}
