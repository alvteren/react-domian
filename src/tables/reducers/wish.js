import keyBy from "lodash/keyBy";
const initialState = {
  data: {},
  count: 0
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "FETCH_WISH_SUCCESS":
      const newValues = {
        data: keyBy(payload.data, "id"),
        count: payload.count
      };
      return { ...state, ...newValues };
    case "ADD_TO_WISH_SUCCESS":
      return { ...state, ...{ isAdded: true } };
    case "CHECK_ADDED_TO_WISH_SUCCESS":
      return { ...state, ...{ isAdded: payload } };
    default:
      return state;
  }
};
