const initialState = {
  locationSearch: {
    open: false,
    result: {},
    loading: false
  }
};

export default (state = initialState, action) => {
  if (action.type === "FORM_LOCATION_SEARCH_OPENED") {
    const newState = {
      locationSearch: { ...state.locationSearch, open: action.payload }
    };
    return { ...state, ...newState };
  }
  if (action.type === "FORM_LOCATION_SEARCH_FETCH_START") {
    const newState = {
      locationSearch: {
        ...state.locationSearch,
        loading: true
      }
    };
    return { ...state, ...newState };
  }
  if (action.type === "FORM_LOCATION_SEARCH_FETCH_SUCCESS") {
    const newState = {
      locationSearch: {
        ...state.locationSearch,
        result: action.payload,
        loading: false
      }
    };
    return { ...state, ...newState };
  }
  return state;
};
