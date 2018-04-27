import { size, omit, keyBy, orderBy, toArray, without } from "lodash";

export default (state, { type, payload }) => {
  let newstate = null;
  if (state) {
    if (type === "TABLE_FETCH_DATA_START") {
      newstate = {
        ...state,
        loading: { ...state.loading, data: true }
      };
    } else if (type === "TABLE_FETCH_SETTING_SUCCESS") {
      return state;
      // return { ...state, ...payload };
    } else if (type === "TABLE_TOGGLE_ROW") {
      const { rowId } = payload;
      const { selected } = state;
      const selectedIndex = selected.indexOf(rowId);
      const newSelected =
        selectedIndex === -1 ? [...selected, rowId] : without(selected, rowId);

      newstate = {
        ...state,
        selected: newSelected
      };
    } else if (type === "TABLE_TOGGLE_ALL_ROW") {
      const { checked } = payload;
      const newSelected = !checked ? [] : toArray(state.data).map(n => n.id);
      newstate = {
        ...state,
        selected: newSelected
      };
    } else if (type === "TABLE_CHANGE_PAGE") {
      const { page } = payload;
      newstate = {
        ...state,
        page
      };
    } else if (type === "TABLE_CHANGE_ROWS_PER_PAGE") {
      const { rowsPerPage } = payload;
      newstate = {
        ...state,
        rowsPerPage
      };
    } else if (type === "TABLE_FETCH_DATA_SUCCESS") {
      const { data, count } = payload;
      newstate = {
        ...state,
        data: { ...state.data, ...data },
        count,
        loading: { ...state.loading, data: false }
      };
    } else if (type === "TABLE_REMOVED_SELECTED_DATA") {
      const { selected, data } = state;
      const omitData = omit(data, selected);
      const count = size(omitData);
      newstate = {
        ...state,
        ...{ data: omitData, selected: [] },
        count
      };
    } else if (type === "TABLE_REQUEST_SORT") {
      const newOrderBy = payload.orderBy;
      const { data } = state;

      let order = "desc";

      if (state.orderBy === newOrderBy && state.order === "desc") {
        order = "asc";
      }

      const realOrderBy = () => {
        /** replace ordering column */
        if (newOrderBy === "date") {
          return "dateUnix";
        }
        return newOrderBy;
      };

      const newData = orderBy(data, realOrderBy(), [order]);

      newstate = {
        ...state,
        ...{ data: newData },
        ...{ order, orderBy: newOrderBy }
      };
    } else if (type === "TABLE_CLEAR_DATA") {
      newstate = {
        ...state,
        data: {},
        selected: [],
        count: 0,
        page: 0,
        loadedPages: {}
      };
    }

    if (newstate) {
      return { ...state, ...newstate };
    }
  }

  return null;
};
