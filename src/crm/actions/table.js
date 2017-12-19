import { fetchTableHeaders as fetchTableHeadersApi } from "../../api/table";

export const fetchTableHeaders = props => async dispatch => {
  const { id } = props;
  try {
    dispatch({ type: "TABLE_FETCH_SETTING_START" });
    await fetchTableHeadersApi({ id });
    dispatch({ type: "TABLE_FETCH_SETTING_SUCCESS" });
  } catch (err) {
    dispatch({ type: "TABLE_FETCH_SETTING_ERROR", payload: err, error: true });
  }
};

export const toggleRow = props => dispatch => {
  dispatch({ type: "TABLE_TOGGLE_ROW", payload: props });
};
export const toggleAllRow = props => dispatch => {
  dispatch({ type: "TABLE_TOGGLE_ALL_ROW", payload: props });
};
export const changePage = props => dispatch => {
  dispatch({ type: "TABLE_CHANGE_PAGE", payload: props });
};
export const changeRowsPerPage = props => dispatch => {
  dispatch({ type: "TABLE_CHANGE_ROWS_PER_PAGE", payload: props });
};
export const requestSort = props => dispatch => {
  dispatch({ type: "TABLE_REQUEST_SORT", payload: props });
};
export const clearData = props => dispatch => {
  dispatch({ type: "TABLE_CLEAR_DATA", payload: props });
};
