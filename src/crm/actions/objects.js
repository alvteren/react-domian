import { fetchObjects as fetchObjectsApi } from "../../api";

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
