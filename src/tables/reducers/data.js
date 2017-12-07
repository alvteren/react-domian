import without from "lodash/without";
import toArray from "lodash/toArray";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import keyBy from "lodash/keyBy";
import omit from "lodash/omit";
import size from "lodash/size";

const initialState = {
  wish: {
    headers: {
      name: {
        id: "name",
        label: "Наименование"
      },
      section: {
        id: "section",
        label: "Раздел"
      },
      typeDeal: {
        id: "typeDeal",
        label: "Тип сделки"
      },
      source: {
        id: "source",
        label: "Откуда"
      },
      contacts: {
        id: "contacts",
        label: "Контакты"
      },
      price: {
        id: "price",
        label: "Цена"
      },
      address: {
        id: "address",
        label: "Адрес"
      },
      date: {
        id: "date",
        label: "Дата"
      },
      square: {
        id: "square",
        label: "Площадь"
      },
      squareArea: {
        id: "squareArea",
        label: "Площадь участка"
      }
    },
    data: {},
    count: 0,
    selected: [],
    page: 0,
    rowsPerPage: 5,
    tooltipTitle: "Список отобранных объектов",
    orderBy: "date",
    order: "desc",
    status: "loading",
    wishId: 0
  }
};

export default (state = initialState, { type, payload }) => {
  const id = get(payload, "id", null);
  const tableState = id ? get(state, id, null) : null;
  let newTableState = null;

  if (tableState) {
    if (type === "TABLE_FETCH_DATA_START") {
      newTableState = {
        ...tableState,
        ...{ status: "loading" }
      };
    }
    if (type === "TABLE_FETCH_SETTING_SUCCESS") {
      return state;
      // return { ...state, ...payload };
    }
    if (type === "TABLE_TOGGLE_ROW") {
      const { rowId } = payload;
      const { selected } = tableState;
      const selectedIndex = selected.indexOf(rowId);
      const newSelected =
        selectedIndex === -1 ? [...selected, rowId] : without(selected, rowId);

      newTableState = {
        ...tableState,
        ...{ selected: newSelected }
      };
    }

    if (type === "TABLE_TOGGLE_ALL_ROW") {
      const { checked } = payload;
      const newSelected = !checked
        ? []
        : toArray(tableState.data).map(n => n.id);
      newTableState = {
        ...tableState,
        ...{ selected: newSelected }
      };
    }

    if (type === "TABLE_CHANGE_PAGE") {
      const { page } = payload;
      newTableState = {
        ...tableState,
        ...{ page }
      };
    }

    if (type === "TABLE_CHANGE_ROWS_PER_PAGE") {
      const { rowsPerPage } = payload;
      newTableState = {
        ...tableState,
        ...{ rowsPerPage }
      };
    }

    if (type === "TABLE_FETCH_DATA_SUCCESS") {
      const { data, count } = payload;
      newTableState = {
        ...tableState,
        ...{ data: keyBy(data, "id") },
        count,
        ...{ status: "loaded" }
      };
    }

    if (type === "TABLE_REMOVED_SELECTED_DATA") {
      const { selected, data } = tableState;
      const omitData = omit(data, selected);
      const count = size(omitData);
      newTableState = {
        ...tableState,
        ...{ data: omitData, selected: [] },
        count
      };
    }

    if (type === "TABLE_REQUEST_SORT") {
      const newOrderBy = payload.orderBy;
      const { data } = tableState;

      let order = "desc";

      if (tableState.orderBy === newOrderBy && tableState.order === "desc") {
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

      newTableState = {
        ...tableState,
        ...{ data: newData },
        ...{ order, orderBy: newOrderBy }
      };
    }
    if (newTableState) {
      return { ...state, ...{ [id]: newTableState } };
    }
  }

  return state;
};
