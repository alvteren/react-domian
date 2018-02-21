const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "USER_AUTHORIZE_SUCCESS":
    case "USER_CURRENT_GET_SUCCESS":
      const newValues = {
        ...payload
      };
      return { ...state, ...newValues };
    default:
      return state;
  }
};
