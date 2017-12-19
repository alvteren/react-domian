import { clearData } from "./table";
import { fetchObjects } from "./objects";
import { fetchChips as fetchChipsApi } from "../../api/chips";

export const deleteChip = props => dispatch => {
  const { id, chipId } = props;

  dispatch({ type: "CHIPS_DELETED_SUCCESS", payload: { id, chipId } });
  dispatch(applyFilter({ id }));
};

export const fetchChips = props => async dispatch => {
  const { id, query } = props;
  try {
    dispatch({ type: "CHIPS_FETCH_STARTED", payload: { id } });

    const data = await fetchChipsApi({
      id,
      query
    });
    dispatch({
      type: "CHIPS_FETCH_SUCCESS",
      payload: { id: "objects", data: data }
    });
  } catch (err) {
    dispatch({ type: "CHIPS_FETCH_ERROR", payload: err, error: true });
  }
};

export const applyFilter = props => async (dispatch, getState) => {
  const { id } = props;

  const { filter, rowsPerPage, order, orderBy, page } = getState().crm[id];

  dispatch(clearData({ id }));
  if (page === 0) {
    dispatch(fetchObjects({ filter, page, rowsPerPage, orderBy, order }));
  }
};
