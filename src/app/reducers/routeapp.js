export const initialState = {
  params: {}
};

export default (state = initialState, { type, payload }) => {
  if (type === "ROUTE_APP_UPDATE_PARAMS") {
    return { ...state, params: payload };
  }

  return state;
};
