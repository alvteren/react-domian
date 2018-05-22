import {
  uploadFile,
  fetchSearchResult as fetchSearchResultApi
} from "../../api/form";

import { savePropToServer } from "./crm";

export const setInitFormState = props => dispatch => {
  const { initState, entityId } = props;
  dispatch({
    type: "SET_INIT_FORM_STATE",
    payload: { initState, entityId }
  });
};
export const saveToStore = props => async dispatch => {
  const { entityId, elementId, name, value } = props;
  dispatch({
    type: "FORM_SAVE_TO_STORE",
    payload: { entityId, elementId, name, value }
  });
};
export const saveFile = props => async dispatch => {
  const { entityId, elementId, name, file } = props;
  const result = await uploadFile(file);
  const { preview } = file;
  const value = preview ? { ...result, src: preview } : result;
  dispatch({
    type: "FORM_SAVE_FILE",
    payload: { entityId, elementId, name, value }
  });
  dispatch(savePropToServer({ entityId, elementId, name, value }));
};

export const openLocationSearch = props => async dispatch => {
  dispatch(switchLocationSearch(true));
};
export const closeLocationSearch = props => async dispatch => {
  dispatch(switchLocationSearch(false));
};
export const switchLocationSearch = props => async dispatch => {
  dispatch({
    type: "FORM_LOCATION_SEARCH_OPENED",
    payload: props
  });
};

export const fetchSearchResult = query => async dispatch => {
  try {
    dispatch({
      type: "FORM_LOCATION_SEARCH_FETCH_START",
      payload: {}
    });
    const data = await fetchSearchResultApi({ query });
    dispatch({
      type: "FORM_LOCATION_SEARCH_FETCH_SUCCESS",
      payload: { ...data }
    });
  } catch (err) {
    dispatch({
      type: "FORM_LOCATION_SEARCH_FETCH_ERROR",
      payload: err,
      error: true
    });
  }
};
export const validateFormError = props => dispatch => {
  const { entityId, elementId, errorObj } = props;
  dispatch({
    type: "FORM_VALIDATION_ERROR",
    payload: { id: entityId, elementId, errorObj }
  });
};
