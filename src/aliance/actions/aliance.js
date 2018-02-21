import { fetchList as fetchListApi } from "../../api/aliance";
import { joinToAliance as joinToAlianceApi } from "../../api/aliance";
import { getMembers as getMembersApi } from "../../api/aliance";
import { createAliance as createAlianceApi } from "../../api/aliance";

export const fetchList = props => async dispatch => {
  const { filter } = props;
  try {
    dispatch({ type: "ALIANCE_LIST_FETCH_STARTED", payload: { filter } });

    const data = await fetchListApi({ filter });
    dispatch({
      type: "ALIANCE_LIST_FETCH_SUCCESS",
      payload: data
    });
  } catch (err) {
    dispatch({ type: "ALIANCE_LIST_FETCH_ERROR", payload: err, error: true });
  }
};
export const joinToAliance = id => async dispatch => {
  try {
    dispatch({ type: "ALIANCE_JOIN_SEND_STARTED", payload: { id } });

    const data = await joinToAlianceApi({ id });
    dispatch({
      type: "ALIANCE_JOIN_SEND_COMPLETE",
      payload: data
    });
  } catch (err) {
    dispatch({ type: "ALIANCE_JOIN_SEND_ERROR", payload: err, error: true });
  }
};
export const getMembers = props => async dispatch => {
  const { id } = props;
  try {
    dispatch({ type: "ALLIANCE_GET_MEMBERS_STARTED", payload: { id } });

    var data = await getMembersApi({ id });
    dispatch({
      type: "ALLIANCE_GET_MEMBERS_COMPLETE",
      payload: { id, data }
    });
  } catch (err) {
    dispatch({ type: "ALLIANCE_GET_MEMBERS_ERROR", payload: err, error: true });
  }
};
export const createAliance = props => async dispatch => {
  const { name } = props;
  try {
    dispatch({ type: "ALIANCE_CREATE_STARTED", payload: { name } });

    const data = await createAlianceApi({ name });
    dispatch({
      type: "ALIANCE_CREATE_SUCCESS",
      payload: data
    });
    dispatch(fetchList({ filter: {} }));
  } catch (err) {
    dispatch({ type: "ALIANCE_CREATE_ERROR", payload: err, error: true });
  }
};
