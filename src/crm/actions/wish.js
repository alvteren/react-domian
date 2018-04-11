import {
  fetchWishObjects as fetchWishObjectsApi,
  addToWish as addToWishApi,
  removeFromWish as removeFromWishApi
} from "../../api/wish";

import { fetchTableHeaders as fetchTableHeadersApi } from "../../api/table";

export const fetchWish = props => async dispatch => {
  const { wishId } = props;
  try {
    dispatch({ type: "FETCH_WISH_START" });
    dispatch({ type: "TABLE_FETCH_DATA_START" });
    const data = await fetchWishObjectsApi({ wishId });
    dispatch({ type: "FETCH_WISH_SUCCESS", payload: data });
    dispatch({
      type: "TABLE_FETCH_DATA_SUCCESS",
      payload: { id: "wish", ...data }
    });
  } catch (err) {
    dispatch({ type: "FETCH_WISH_ERROR", payload: err, error: true });
    dispatch({ type: "TABLE_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const addToWish = props => async dispatch => {
  const { wishId, objectsId } = props;
  try {
    dispatch({ type: "ADD_TO_WISH_START" });
    await addToWishApi({ wishId, objectsId });
    dispatch({ type: "ADD_TO_WISH_SUCCESS", payload: objectsId });
  } catch (err) {
    dispatch({ type: "ADD_TO_WISH_ERROR", payload: err, error: true });
  }
};
export const removeFromWish = props => async dispatch => {
  const { wishId, objectsId } = props;
  try {
    dispatch({ type: "REMOVE_FROM_WISH_START" });
    dispatch({
      type: "TABLE_REMOVED_SELECTED_DATA",
      payload: { id: "wish" }
    });
    await removeFromWishApi({ wishId, objectsId });
    dispatch({ type: "REMOVE_FROM_WISH_SUCCESS", payload: objectsId });
  } catch (err) {
    dispatch({ type: "REMOVE_FROM_WISH_ERROR", payload: err, error: true });
  }
};

export const fetchTableHeaders = props => async dispatch => {
  try {
    dispatch({ type: "FETCH_TABLE_SETTING_START" });
    await fetchTableHeadersApi("wish");
    dispatch({ type: "FETCH_TABLE_SETTING_SUCCESS" });
  } catch (err) {
    dispatch({ type: "FETCH_TABLE_SETTING_ERROR", payload: err, error: true });
  }
};
