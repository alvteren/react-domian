import { authorizeBy as authorizeByApi } from "../../api/auth";
import { authorize as authorizeApi } from "../../api/auth";
import { getCurrentUser as getCurrentUserApi } from "../../api/auth";
import { omit } from "lodash";

export const authorizeBy = userId => async dispatch => {
  try {
    dispatch({ type: "USER_AUTHORIZE_START" });
    const data = await authorizeByApi(userId);
    if (data.status === "success") {
      dispatch({
        type: "USER_AUTHORIZE_SUCCESS",
        payload: omit(data, ["status"])
      });
    } else {
      dispatch({
        type: "USER_AUTHORIZE_ERROR",
        payload: data.message,
        error: true
      });
    }
  } catch (err) {
    dispatch({ type: "USER_AUTHORIZE_ERROR", payload: err, error: true });
  }
};
export const authorize = props => async dispatch => {
  const { login, password } = props;
  try {
    dispatch({ type: "USER_AUTHORIZE_START" });
    const data = await authorizeApi({ login, password });
    if (data.status === "success") {
      dispatch({
        type: "USER_AUTHORIZE_SUCCESS",
        payload: omit(data, ["status"])
      });
    } else {
      dispatch({
        type: "USER_AUTHORIZE_ERROR",
        payload: data.message,
        error: true
      });
    }
  } catch (err) {
    dispatch({ type: "USER_AUTHORIZE_ERROR", payload: err, error: true });
  }
};
export const getCurrentUser = () => async dispatch => {
  try {
    dispatch({ type: "USER_CURRENT_GET_START" });
    const data = await getCurrentUserApi();
    if (data.status === "success") {
      dispatch({
        type: "USER_CURRENT_GET_SUCCESS",
        payload: omit(data, ["status"])
      });
    } else {
      dispatch({
        type: "USER_CURRENT_NEED_AUTH"
      });
    }
  } catch (err) {
    dispatch({ type: "RESPONSE_ERROR", payload: err, error: true });
  }
};
