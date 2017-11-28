import {
  fetchWishObjects as fetchWishObjectsApi,
  addToWish as addToWishApi,
  removeFromWish as removeFromWishApi
} from "../../api";

export const fetchWish = ({ id }) => async dispatch => {
  try {
    dispatch({ type: "FETCH_WISH_START" });
    const objects = await fetchWishObjectsApi({ id });
    dispatch({ type: "FETCH_WISH_SUCCESS", payload: objects });
  } catch (err) {
    dispatch({ type: "FETCH_WISH_ERROR", payload: err, error: true });
  }
};

export const addToWish = ({ id, objectId }) => async dispatch => {
  try {
    dispatch({ type: "ADD_TO_WISH_START" });
    await addToWishApi({ id, objectId });
    dispatch({ type: "ADD_TO_WISH_SUCCESS" });
  } catch (err) {
    dispatch({ type: "ADD_TO_WISH_ERROR", payload: err, error: true });
  }
};
export const removeFromWish = ({ id, objectId }) => async dispatch => {
  try {
    dispatch({ type: "REMOVE_FROM_WISH_START" });
    await removeFromWishApi({ id, objectId });
    dispatch({ type: "REMOVE_FROM_WISH_SUCCESS" });
  } catch (err) {
    dispatch({ type: "REMOVE_FROM_WISH_ERROR", payload: err, error: true });
  }
};
