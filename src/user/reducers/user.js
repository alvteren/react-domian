const initialState = {};

export default (state = initialState, { type, payload }) => {
  if (type === "ALIANCE_JOIN_SEND_COMPLETE") {
    return { ...state, aliance_joined: true };
  }
  if (
    type === "USER_AUTHORIZE_SUCCESS" ||
    type === "USER_CURRENT_GET_SUCCESS"
  ) {
    const newValues = {
      ...payload
    };
    return { ...state, ...newValues };
  }

  return state;
};
