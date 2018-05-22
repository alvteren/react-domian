import {
  fetchList as fetchListApi,
  fetchDetail as fetchDetailApi,
  fetchFields as fetchFieldsApi,
  deleteElement as deleteElementApi,
  savePropToServer as savePropToServerApi,
  saveFormToServer as saveFormToServerApi
} from "../../api/crm";

export const fetchList = props => async dispatch => {
  const { entityId, filter, page, rowsPerPage, orderBy, order } = props;
  try {
    dispatch({
      type: "TABLE_FETCH_DATA_START",
      payload: { entityId }
    });
    const data = await fetchListApi({
      entityId,
      filter,
      limit: [page * rowsPerPage, rowsPerPage],
      orderBy,
      order
    });
    dispatch({
      type: "TABLE_FETCH_DATA_SUCCESS",
      payload: { entityId, ...data }
    });
  } catch (err) {
    dispatch({ type: "TABLE_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const fetchDetail = props => async dispatch => {
  const { elementId, entityId } = props;

  try {
    dispatch({
      type: "DETAIL_FETCH_DATA_START",
      payload: { entityId }
    });
    const data = await fetchDetailApi({ entityId, elementId });
    dispatch({
      type: "DETAIL_FETCH_DATA_SUCCESS",
      payload: { entityId, ...data }
    });
  } catch (err) {
    dispatch({ type: "DETAIL_FETCH_DATA_ERROR", payload: err, error: true });
  }
};
export const onInitDetail = props => async dispatch => {
  const { elementId, entityId } = props;
  dispatch({
    type: "DETAIL_INIT",
    payload: { entityId, current: elementId }
  });
};

export const fetchFields = props => async dispatch => {
  const { entityId } = props;
  try {
    dispatch({
      type: "FORM_FIELDS_FETCH_START",
      payload: { entityId }
    });
    const data = await fetchFieldsApi({ entityId });
    dispatch({
      type: "FORM_FIELDS_FETCH_SUCCESS",
      payload: { entityId, data }
    });
  } catch (err) {
    dispatch({ type: "FORM_FIELDS_FETCH_ERROR", payload: err, error: true });
  }
};
export const deleteElement = props => async dispatch => {
  const { entityId, elementId } = props;
  try {
    dispatch({
      type: "FORM_FIELDS_FETCH_START",
      payload: { entityId }
    });
    const data = await deleteElementApi({ entityId, elementId });
    dispatch({
      type: "FORM_FIELDS_FETCH_SUCCESS",
      payload: { entityId, data }
    });
  } catch (err) {
    dispatch({ type: "FORM_FIELDS_FETCH_ERROR", payload: err, error: true });
  }
};
export const savePropToServer = props => async dispatch => {
  try {
    dispatch({
      type: "PROP_SAVE_TO_SERVER_START",
      payload: {}
    });
    const data = await savePropToServerApi(props);
    dispatch({
      type: "PROP_SAVE_TO_SERVER_SUCCESS",
      payload: { ...data }
    });
  } catch (err) {
    dispatch({
      type: "PROP_SAVE_TO_SERVER_ERROR",
      payload: err,
      error: true
    });
  }
};
export const saveFormToServer = props => async dispatch => {
  try {
    dispatch({
      type: "FORM_SAVE_TO_SERVER_START",
      payload: {}
    });
    const data = await saveFormToServerApi(props);
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
