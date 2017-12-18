import { keyBy, get } from "lodash";

import tableData from "./tableData";
import filterData from "./filterData";

export const initialState = {
  filter: {},
  cacheQuery: [],
  chips: {},
  selectedChips: {
    type_premises_1: {
      id: "type_premises_1",
      label: "1к квартира",
      searchable: "1к квартира однокомнатная",
      type: "type"
    },
    type_premises_2: {
      id: "type_premises_2",
      label: "2к квартира",
      searchable: "2к квартира двухкомнатная",
      type: "type"
    },

    section_137: {
      id: "section_137",
      label: "Квартиры",
      searchable: "квартира квартиры",
      type: "section"
    },
    user_1: {
      id: "user_1",
      label: "Александр Терентьев",
      avatar: "AT",
      searchable: "александр терентьев разработчик",
      type: "user"
    }
  },
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
  loadedPages: {},
  page: 0,
  rowsPerPage: 5,
  tooltipTitle: "Объекты",
  orderBy: "date",
  order: "desc",
  loading: {
    chips: false,
    data: true
  }
};

export default (state = initialState, { type, payload }) => {
  if (type === "FETCH_OBJECTS_SUCCESS") {
    const { data, count } = payload;
    const newData = keyBy(data, "id");

    return { ...state, data: { ...state.data, ...newData }, count };
  }

  const id = get(payload, "id", null);
  if (id === "objects") {
    const newTableState = tableData(state, { type, payload });
    const newFilterState = filterData(state, { type, payload });
    if (newTableState) {
      return { ...state, ...newTableState };
    } else if (newFilterState) {
      return { ...state, ...newFilterState };
    }
  }
  return state;
};
