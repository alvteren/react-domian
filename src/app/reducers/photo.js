export const initialState = {
  bigPhoto: null
};

export default (state = initialState, { type, payload }) => {
  if (type === "SHOW_BIG_PHOTO") {
    return { ...state, ...{ bigPhoto: payload } };
  }
  if (type === "HIDE_BIG_PHOTO") {
    return { ...state, ...{ bigPhoto: null } };
  }

  return state;
};
