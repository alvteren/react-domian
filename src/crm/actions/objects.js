import { fetchObjects as fetchObjectsApi } from "../../api";
import { fetchObject as fetchObjectApi } from "../../api";
import { fetchObjectFields as fetchObjectFieldsApi } from "../../api";

export const fetchObjects = props => async dispatch => {
  const { filter, page, rowsPerPage, orderBy, order } = props;
  try {
    dispatch({
      type: "TABLE_FETCH_DATA_START",
      payload: { id: "objects" }
    });
    const data = await fetchObjectsApi({
      filter,
      limit: [page * rowsPerPage, rowsPerPage],
      orderBy,
      order
    });
    dispatch({
      type: "TABLE_FETCH_DATA_SUCCESS",
      payload: { id: "objects", ...data }
    });
  } catch (err) {
    dispatch({ type: "TABLE_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const fetchObject = id => async dispatch => {
  try {
    dispatch({
      type: "DETAIL_FETCH_DATA_START",
      payload: { id: "objects" }
    });
    const data = await fetchObjectApi({
      id
    });
    dispatch({
      type: "DETAIL_FETCH_DATA_SUCCESS",
      payload: { id: "objects", ...data }
    });
  } catch (err) {
    dispatch({ type: "DETAIL_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const fetchObjectFields = () => async dispatch => {
  try {
    dispatch({
      type: "FETCH_FIELDS_START",
      payload: { id: "objects" }
    });
    const data = await fetchObjectFieldsApi();
    dispatch({
      type: "FETCH_FIELDS_SUCCESS",
      payload: { id: "objects", ...data }
    });
  } catch (err) {
    dispatch({ type: "FETCH_FIELDS_ERROR", payload: err, error: true });
  }
};
