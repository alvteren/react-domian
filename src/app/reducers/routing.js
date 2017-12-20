import { LOCATION_CHANGE } from "react-router-redux";

export const initialState = {
  location: null,
  historyPath: []
};

export default (state = initialState, { type, payload }) => {
  if (type === LOCATION_CHANGE) {
    const { key } = payload;
    if (key) {
      const historyPath = [...state.historyPath, payload];
      return { ...state, ...{ location: payload, historyPath } };
    }
  }

  return state;
};
