import {
  FORM_SEARCH_OPENED,
  FORM_SEARCH_FETCH_SUCCESS,
  FORM_SEARCH_FETCH_START
} from "../actions/form";

const initialState = {
  search: {
    location: {
      open: false,
      result: {},
      loading: false
    },
    street: {
      open: false,
      result: {},
      loading: false
    }
  }
};

export default (state = initialState, action) => {
  const { payload = {} } = action;
  const { entitySearch = null } = payload;

  if (action.type === FORM_SEARCH_OPENED) {
    const { open } = payload;
    const newState = {
      [entitySearch]: { ...state[entitySearch], open }
    };
    return { ...state, ...newState };
  }
  if (action.type === FORM_SEARCH_FETCH_START) {
    const newState = {
      [entitySearch]: {
        ...state[entitySearch],
        loading: true
      }
    };
    return { ...state, ...newState };
  }
  if (action.type === FORM_SEARCH_FETCH_SUCCESS) {
    const { data } = payload;

    const newState = {
      [entitySearch]: {
        ...state[entitySearch],
        result: data,
        loading: false
      }
    };
    return { ...state, ...newState };
  }
  return state;
};
