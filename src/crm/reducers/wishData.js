import {
  FETCH_WISH_SUCCESS,
  ADD_TO_WISH_SUCCESS,
  REMOVE_FROM_WISH_SUCCESS
} from "../actions/wish";

export default (state, { type, payload }) => {
  if (type === FETCH_WISH_SUCCESS) {
    return payload.data;
  }
  if (type === ADD_TO_WISH_SUCCESS) {
    const { elementsId } = payload;
    const newWishes = elementsId.reduce((result, elementId) => {
      return { ...result, [elementId]: true };
    }, {});

    return { ...state.wish, ...newWishes };
  }
  if (type === REMOVE_FROM_WISH_SUCCESS) {
    const { wish } = state;
    const { elementsId } = payload;

    elementsId.forEach(elementId => {
      delete wish[elementId];
    });

    return wish;
  }

  return null;
};
