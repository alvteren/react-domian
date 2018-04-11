import {
  FETCH_WISH_SUCCESS,
  ADD_TO_WISH_SUCCESS,
  REMOVE_FROM_WISH_SUCCESS
} from "../actions/wish";

export default (state, { type, payload }) => {
  switch (type) {
    case FETCH_WISH_SUCCESS:
      return payload.data;

    case ADD_TO_WISH_SUCCESS:
      return { ...state.wish, ...{ [payload]: true } };

    case REMOVE_FROM_WISH_SUCCESS:
      const { wish } = state;
      delete wish[payload];
      return { wish };
    default: {
      return null;
    }
  }
};
