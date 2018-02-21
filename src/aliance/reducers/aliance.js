const initialState = {
  filter: {},
  orderBy: "",
  order: "",
  page: 0,
  count: 0,
  rowsPerPage: 20,
  data: {}
};

export default (state = initialState, action) => {
  if (action.type === "ALIANCE_LIST_FETCH_SUCCESS") {
    const { data, count } = action.payload;
    return { ...state, data: { ...state.data, ...data }, count };
  }
  if (action.type === "ALLIANCE_GET_MEMBERS_STARTED") {
    return { ...state, status: "loading" };
  }
  if (action.type === "ALLIANCE_GET_MEMBERS_COMPLETE") {
    const { id, data } = action.payload;
    const allianceKey = "aliance" + id;
    const newStateAlliance = { ...state.data[allianceKey], members: data };

    return {
      ...state,
      status: "loaded",
      data: {
        ...state.data,
        [allianceKey]: newStateAlliance
      }
    };
  }

  return state;
};
