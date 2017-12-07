import { authorizeBy as authorizeByApi } from "../../api/auth";

export const authorizeBy = userId => async dispatch => {
  try {
    dispatch({ type: "USER_AUTHORIZE_START" });
    const data = await authorizeByApi(userId);
    if (data.status === "success") {
      dispatch({ type: "USER_AUTHORIZE_SUCCESS" });
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
