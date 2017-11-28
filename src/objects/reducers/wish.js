const initialState = "";
import keyBy from "lodash/keyBy";
const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "FETCH_WISH_SUCCESS":
      const newValues = keyBy(payload, "id");
      return { ...state, newValues };
  }
};
