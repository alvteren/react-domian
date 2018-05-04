import {
  uploadFile,
  fetchSearchResult as fetchSearchResultApi,
  saveToServer as saveToServerApi
} from "../../api/form";
export const setInitFormState = props => dispatch => {
  const { initState, id } = props;
  dispatch({
    type: "SET_INIT_FORM_STATE",
    payload: { initState, id }
  });
};
export const saveToStore = props => async dispatch => {
  const { id, elementId, name, value } = props;
  dispatch({
    type: "FORM_SAVE_TO_STORE",
    payload: { id, elementId, name, value }
  });
};
export const saveToServer = props => async dispatch => {
  try {
    dispatch({
      type: "FORM_SAVE_TO_SERVER_START",
      payload: {}
    });
    const data = await saveToServerApi(props);
    dispatch({
      type: "FORM_SAVE_TO_SERVER_SUCCESS",
      payload: { ...data }
    });
  } catch (err) {
    dispatch({
      type: "FORM_SAVE_TO_SERVER_ERROR",
      payload: err,
      error: true
    });
  }
};
export const saveFile = props => async dispatch => {
  const { id, elementId, name, file } = props;
  const result = await uploadFile(file);
  const { preview } = file;
  const value = preview ? { ...result, src: preview } : result;
  dispatch({
    type: "FORM_SAVE_FILE",
    payload: { id, elementId, name, value }
  });
  dispatch(saveToServer({ id, elementId, name, value }));
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
