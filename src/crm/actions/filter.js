import { clearData } from "./table";
import { fetchList } from "./crm";
import { fetchChips as fetchChipsApi } from "../../api/chips";

export const deleteChip = props => dispatch => {
  const { entityId, chipId } = props;

  dispatch({ type: "CHIPS_DELETED_SUCCESS", payload: { entityId, chipId } });
  dispatch(applyFilter({ entityId }));
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
      payload: { id: id, data: data }
    });
  } catch (err) {
    dispatch({ type: "CHIPS_FETCH_ERROR", payload: err, error: true });
  }
};

export const selectChip = props => dispatch => {
  const { entityId, chip } = props;
  dispatch({ type: "CHIPS_ADDED_SUCCESS", payload: { entityId, chip } });
  dispatch(applyFilter({ entityId }));
};

export const applyFilter = props => async (dispatch, getState) => {
  const { entityId } = props;

  const { filter, rowsPerPage, order, orderBy, page } = getState().crm[
    entityId
  ];

  dispatch(clearData({ entityId }));
  if (page === 0) {
    dispatch(
      fetchList({ entityId, filter, page, rowsPerPage, orderBy, order })
    );
  }
};
