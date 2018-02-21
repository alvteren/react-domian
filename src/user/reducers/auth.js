const initialState = {
  isAuthorized: null,
  hasError: false,
  message: "",
  status: ""
};

export default (state = initialState, { type, payload }) => {
  if (
    type === "USER_AUTHORIZE_SUCCESS" ||
    type === "USER_CURRENT_GET_SUCCESS"
  ) {
    const newValues = {
      isAuthorized: true,
      hasError: false,
      status: "loaded",
      ...payload
    };
    return { ...state, ...newValues };
  }
  if (type === "USER_CURRENT_NEED_AUTH") {
    const newValues = {
      isAuthorized: false,
      ...payload
    };
    return { ...state, ...newValues };
  }
  if (type === "USER_AUTHORIZE_START") {
    const newValues = {
      status: "loading",
      ...payload
    };
    return { ...state, ...newValues };
  }
  if (type === "USER_AUTHORIZE_ERROR") {
    const newValues = {
      isAuthorized: false,
      status: "loaded",
      hasError: true,
      message: payload
    };
    return { ...state, ...newValues };
  }
  return state;
};
