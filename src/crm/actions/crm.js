import {
  fetchList as fetchListApi,
  fetchDetail as fetchDetailApi,
  fetchFields as fetchFieldsApi,
  deleteElement as deleteElementApi,
  savePropToServer as savePropToServerApi,
  saveFormToServer as saveFormToServerApi
} from "../../api/crm";

export const TABLE_FETCH_DATA_START = "TABLE_FETCH_DATA_START";
export const TABLE_FETCH_DATA_SUCCESS = "TABLE_FETCH_DATA_SUCCESS";
export const TABLE_FETCH_DATA_ERROR = "TABLE_FETCH_DATA_ERROR";

export const DETAIL_FETCH_DATA_START = "DETAIL_FETCH_DATA_START";
export const DETAIL_FETCH_DATA_SUCCESS ="DETAIL_FETCH_DATA_SUCCESS";
export const DETAIL_FETCH_DATA_ERROR = "DETAIL_FETCH_DATA_ERROR";

export const DETAIL_INIT = "DETAIL_INIT";

export const FORM_FIELDS_FETCH_START = "FORM_FIELDS_FETCH_START";
export const FORM_FIELDS_FETCH_SUCCESS = "FORM_FIELDS_FETCH_SUCCESS";
export const FORM_FIELDS_FETCH_ERROR = "FORM_FIELDS_FETCH_ERROR";

export const PROP_SAVE_TO_SERVER_START = "PROP_SAVE_TO_SERVER_START";
export const PROP_SAVE_TO_SERVER_SUCCESS = "PROP_SAVE_TO_SERVER_SUCCESS";
export const PROP_SAVE_TO_SERVER_ERROR = "PROP_SAVE_TO_SERVER_ERROR";

export const FORM_SAVE_TO_SERVER_START = "FORM_SAVE_TO_SERVER_START";
export const FORM_SAVE_TO_SERVER_SUCCESS = "FORM_SAVE_TO_SERVER_SUCCESS";
export const FORM_SAVE_TO_SERVER_ERROR = "FORM_SAVE_TO_SERVER_ERROR";

export const fetchList = props => async dispatch => {
  const { entityId, filter, page, rowsPerPage, orderBy, order } = props;
  try {
    dispatch({
      type: TABLE_FETCH_DATA_START,
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
      type: TABLE_FETCH_DATA_SUCCESS,
      payload: { entityId, ...data }
    });
  } catch (err) {
    dispatch({ type: TABLE_FETCH_DATA_ERROR, payload: err, error: true });
  }
};

export const fetchDetail = props => async dispatch => {
  const { elementId, entityId } = props;

  try {
    dispatch({
      type: DETAIL_FETCH_DATA_START,
      payload: { entityId }
    });
    const data = await fetchDetailApi({ entityId, elementId });
    dispatch({
      type: DETAIL_FETCH_DATA_SUCCESS,
      payload: { entityId, ...data }
    });
  } catch (err) {
    dispatch({ type: DETAIL_FETCH_DATA_ERROR, payload: err, error: true });
  }
};
export const onInitDetail = props => async dispatch => {
  const { elementId, entityId } = props;
  dispatch({
    type: DETAIL_INIT,
    payload: { entityId, current: elementId }
  });
};

export const fetchFields = props => async dispatch => {
  const { entityId } = props;
  try {
    dispatch({
      type: FORM_FIELDS_FETCH_START,
      payload: { entityId }
    });
    const data = await fetchFieldsApi({ entityId });
    dispatch({
      type: FORM_FIELDS_FETCH_SUCCESS,
      payload: { entityId, data }
    });
  } catch (err) {
    dispatch({ type: FORM_FIELDS_FETCH_ERROR, payload: err, error: true });
  }
};
export const deleteElement = props => async dispatch => {
  const { entityId, elementId } = props;
  try {
    dispatch({
      type: FORM_FIELDS_FETCH_START,
      payload: { entityId }
    });
    const data = await deleteElementApi({ entityId, elementId });
    dispatch({
      type: FORM_FIELDS_FETCH_SUCCESS,
      payload: { entityId, data }
    });
  } catch (err) {
    dispatch({ type: FORM_FIELDS_FETCH_ERROR, payload: err, error: true });
  }
};
export const savePropToServer = props => async dispatch => {
  try {
    dispatch({
      type: PROP_SAVE_TO_SERVER_START,
      payload: {}
    });
    const data = await savePropToServerApi(props);
    dispatch({
      type: PROP_SAVE_TO_SERVER_SUCCESS,
      payload: { ...data }
    });
  } catch (err) {
    dispatch({
      type: PROP_SAVE_TO_SERVER_ERROR,
      payload: err,
      error: true
    });
  }
};
/**
 *
 * @param props
 *  props = { entityId, elementId, formData } ||
 *          { parent: {entityId, elementId}, child: {entityId, elementId}, formData }
 * @return {function(*)}
 */
export const saveFormToServer = props => async dispatch => {
  const { formData } = props;
  let entityId, elementId;
  if (props.parent && props.child) {
    [entityId, elementId] = [props.child.entityId, props.child.elementId];
  } else {
    [entityId, elementId] = [props.entityId, props.elementId]
  }
  try {
    dispatch({
      type: FORM_SAVE_TO_SERVER_START,
      payload: { entityId, elementId, formData }
    });
    debugger;
    const data = await saveFormToServerApi(props);
    dispatch({
      type: FORM_SAVE_TO_SERVER_SUCCESS,
      payload: { ...data }
    });
  } catch (err) {
    dispatch({
      type: err.action || FORM_SAVE_TO_SERVER_ERROR,
      payload: { entityId, elementId , ...err },
      error: true
    });
  }
};
