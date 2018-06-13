import {
  uploadFile,
  fetchSearchResult as fetchSearchResultApi,
  saveSelectedValue as saveSelectedValueApi
} from "../../api/form";

import { savePropToServer } from "./crm";
export const SET_INIT_FORM_STATE = "SET_INIT_FORM_STATE";
export const FORM_SAVE_TO_STORE = "FORM_SAVE_TO_STORE";
export const FORM_SAVE_FILE = "FORM_SAVE_FILE";
export const FORM_LOCATION_SEARCH_OPENED = "FORM_LOCATION_SEARCH_OPENED";
export const FORM_LOCATION_SEARCH_FETCH_START = "FORM_LOCATION_SEARCH_FETCH_START";
export const FORM_LOCATION_SEARCH_FETCH_SUCCESS = "FORM_LOCATION_SEARCH_FETCH_SUCCESS";
export const FORM_LOCATION_SEARCH_FETCH_ERROR = "FORM_LOCATION_SEARCH_FETCH_ERROR";

export const FORM_SEARCH_OPENED = "FORM_SEARCH_OPENED";
export const FORM_SEARCH_FETCH_START = "FORM_SEARCH_FETCH_START";
export const FORM_SEARCH_FETCH_SUCCESS = "FORM_SEARCH_FETCH_SUCCESS";
export const FORM_SEARCH_FETCH_ERROR = "FORM_SEARCH_FETCH_ERROR";
export const FORM_SEARCH_SAVE_PHRASE_START = "FORM_SEARCH_SAVE_PHRASE_START";
//prettier-ignore
export const FORM_SEARCH_SAVE_PHRASE_SUCCESS = "FORM_SEARCH_SAVE_PHRASE_SUCCESS";
export const FORM_SEARCH_SAVE_PHRASE_ERROR = "FORM_SEARCH_SAVE_PHRASE_ERROR";

export const setInitFormState = props => dispatch => {
  const { initState, entityId } = props;

  dispatch({
    type: SET_INIT_FORM_STATE,
    payload: { initState, entityId }
  });
};
export const saveToStore = props => async dispatch => {
  const { entityId, elementId, name, value, index } = props;

  dispatch({
    type: FORM_SAVE_TO_STORE,
    payload: { entityId, elementId, name, value, index }
  });
};
export const saveFile = props => async dispatch => {
  const { entityId, elementId, name, file } = props;
  const result = await uploadFile(file);
  const { preview } = file;
  const value = preview ? { ...result, src: preview } : result;

  dispatch({
    type: FORM_SAVE_FILE,
    payload: { entityId, elementId, name, value }
  });
  dispatch(savePropToServer({ entityId, elementId, name, value }));
};

export const openSearch = props => async dispatch => {
  const { entitySearch } = props;

  dispatch(switchSearch({ entitySearch, open: true }));
};
export const closeSearch = props => async dispatch => {
  const { entitySearch } = props;

  dispatch(switchSearch({ entitySearch, open: false }));
};
export const switchSearch = props => async dispatch => {
  dispatch({
    type: FORM_SEARCH_OPENED,
    payload: props
  });
};

export const fetchSearchResult = props => async dispatch => {
  const { query, entitySearch, ...other } = props;

  try {
    dispatch({
      type: FORM_SEARCH_FETCH_START,
      payload: {}
    });
    const data = await fetchSearchResultApi({ query, entitySearch, ...other });
    dispatch({
      type: FORM_SEARCH_FETCH_SUCCESS,
      payload: { entitySearch, data }
    });
  } catch (err) {
    dispatch({
      type: FORM_SEARCH_FETCH_ERROR,
      payload: err,
      error: true
    });
  }
};
export const saveSelectedValue = props => async dispatch => {
  const { value, entitySearch, ...other } = props;

  try {
    dispatch({
      type: FORM_SEARCH_SAVE_PHRASE_START,
      payload: {}
    });
    const data = await saveSelectedValueApi({ value, entitySearch, ...other });
    dispatch({
      type: FORM_SEARCH_SAVE_PHRASE_SUCCESS,
      payload: { entitySearch, data }
    });
  } catch (err) {
    dispatch({
      type: FORM_SEARCH_SAVE_PHRASE_ERROR,
      payload: err,
      error: true
    });
  }
};

