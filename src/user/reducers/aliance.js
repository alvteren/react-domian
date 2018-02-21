const initialState = {
  id: 0
};

export default (state = initialState, action) => {
  if (action.type === "ALIANCE_JOIN_SEND_COMPLETE") {
    const { data } = action.payload;
    return { ...state, id: data.id };
  }
  return state;
};
