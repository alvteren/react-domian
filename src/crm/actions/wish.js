import {
  fetchWish as fetchWishApi,
  addToWish as addToWishApi,
  removeFromWish as removeFromWishApi
} from "../../api/wish";

import { get } from "lodash";

export const FETCH_WISH_START = "FETCH_WISH_START";
export const FETCH_WISH_SUCCESS = "FETCH_WISH_SUCCESS";
export const FETCH_WISH_ERROR = "FETCH_WISH_ERROR";
export const ADD_TO_WISH_START = "ADD_TO_WISH_START";
export const ADD_TO_WISH_SUCCESS = "ADD_TO_WISH_SUCCESS";
export const ADD_TO_WISH_ERROR = "ADD_TO_WISH_ERROR";
export const REMOVE_FROM_WISH_START = "REMOVE_FROM_WISH_START";
export const REMOVE_FROM_WISH_SUCCESS = "REMOVE_FROM_WISH_SUCCESS";
export const REMOVE_FROM_WISH_ERROR = "REMOVE_FROM_WISH_ERROR";

export const fetchWish = props => async dispatch => {
  const { entityId } = props;
  const wishId = get(props, "wishId", 0);

  try {
    dispatch({ type: FETCH_WISH_START, payload: { entityId } });
    const data = await fetchWishApi({ wishId, entityId });
    dispatch({ type: FETCH_WISH_SUCCESS, payload: { data, id: entityId } }); // @todo remade "id" to "entityId"
  } catch (err) {
    dispatch({ type: FETCH_WISH_ERROR, payload: err, error: true });
  }
};

export const addToWish = props => async dispatch => {
  const { elementsId, entityId } = props;
  const wishId = get(props, "wishId", 0);
  console.log("addToWish", props);

  try {
    dispatch({ type: ADD_TO_WISH_START, payload: { entityId } });
    await addToWishApi({ wishId, elementsId, entityId });
    dispatch({
      type: ADD_TO_WISH_SUCCESS,
      payload: { elementsId, id: entityId }
    }); // @todo remade "id" to "entityId"
  } catch (err) {
    dispatch({ type: ADD_TO_WISH_ERROR, payload: err, error: true });
  }
};
export const removeFromWish = props => async dispatch => {
  const { elementsId, entityId } = props;
  const wishId = get(props, "wishId", 0);

  try {
    dispatch({ type: REMOVE_FROM_WISH_START, payload: { entityId } });
    await removeFromWishApi({ wishId, elementsId, entityId });
    dispatch({
      type: REMOVE_FROM_WISH_SUCCESS,
      payload: { elementsId, id: entityId } // @todo remade "id" to "entityId"
    });
  } catch (err) {
    dispatch({ type: REMOVE_FROM_WISH_ERROR, payload: err, error: true });
  }
};
