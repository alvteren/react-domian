import { keyBy, get } from "lodash";
import tableData from "./tableData";

export const initialState = {
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
  loading: {
    data: true,
    chips: false
  },
  wishId: 0
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
      // Set recently added ID prop to true, because of backend not returns more data about this ObjectID
      return { ...state, ...{ isAdded: true, data: {...state.data, ...{[payload]:true}} } };

    case "CHECK_ADDED_TO_WISH_SUCCESS":
      return { ...state, ...{ isAdded: payload } };

    case "REMOVE_FROM_WISH_SUCCESS":
      const data = JSON.parse(JSON.stringify(state.data));
      console.log(data);
      debugger;
      delete data[payload];
      return {...state, ...{data}};

    default: {
      const id = get(payload, "id", null);
      if (id === "wish") {
        const newState = tableData(state, { type, payload });
        return { ...state, ...newState };
      }
      return state;
    }
  }
};
