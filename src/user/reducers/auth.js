const initialState = {
  isAuthorized: true
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "USER_AUTHORIZE_SUCCESS":
      const newValues = {
        isAuthorized: true
      };
      return { ...state, ...newValues };
    default:
      return state;
  }
};
