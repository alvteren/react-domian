import {get, keyBy} from "lodash";
import wishData from "./wishData";
import tableData from "./tableData";
import formData from "./formData";
import filterData from "./filterData";

const chips = {
  chips: {},
  selectedChips: {},
  presetsChips: {
    untreated: {
      id: "untreated",
      label: "Мои необработанные",
      searchable: "",
      type: "",
      value: ""
    },
    real: {
      id: "real",
      label: "Мои реальные"
    },
    shows: {
      id: "shows",
      label: "Мои показы"
    },
    deposits: {
      id: "deposits",
      label: "Мои депозиты",
    },
    rejections: {
      id: "rejections",
      label: "Мои отказы"
    }
  }
};

const list = {
  headers: {
    wishes: {
      id: "wishes",
      label: "Пожелания",
    },
    status: {
      id: "status_id",
      label: "Статус",
      type: "status_id",
      value: "NEW"
    },
    reminders: {
      id: "reminders",
      label: "Напоминания"
    },
    created: {
      id: "created",
      label: "Дата создания"
    },
    phone: {
      id: "phone",
      label: "Телефон"
    },
    responsible: {
      id: "responsible",
      label: "Ответственный"
    }
  },
  data: {},
  count: 0,
  selected: [],
  loadedPages: {},
  page: 0,
  rowsPerPage: 5,
  tooltipTitle: "Покупатели",
  orderBy: "",
  order: "desc"
};

const form = {
  fieldsSections: {
    main: {
      name: "Основная информация",
      fields: {
        title: true,
        status_id: true,
        opportunity: true,
        email: true
      }
    },
    more: {
      name: "Подробнее",
      fields: {
        uf_type_deal: true,
        uf_crm_type_realty: true,
        uf_location: true,
        uf_crm_district: true,
        uf_crm_s_area: true,
        uf_type_object_2: true,
        uf_source: true
      }
    }
  },
  // values for form of editing
  editValues: {},
  // values for detail card
  detail: {},
  filterFields: {
    type_apartment: null,
    type_deal: null,
    section_id: null,
    district: null,
    subdistrict: null
  }
};

const fields ={}; // will be fetched from API

export const initialState = {
  ...chips,
  ...list,
  ...form,
  fields,
  filter: {},
  loading: {
    card: false,
    form: false,
    chips: false,
    data: true
  }
};

export default function reducer(state = initialState, { type, payload }) {
  const id = get(payload, "id", null);
  const _id = get(payload, "_id", null);
  if (id === "leads" || _id === "leads") {
    const newTableState = tableData(state, { type, payload });
    const newFilterState = filterData(state, { type, payload });
    const newFormState = formData(state, { type, payload });
    const newWishState = wishData(state, { type, payload });

    // if (type === "FORM_SAVE_TO_STORE") {
    //   const { name, value, elementId } = payload;
    //   if (name === "is_real" && value === false) {
    //     return {
    //       ...state,
    //       values: {
    //         ...state.values,
    //         [elementId]: {
    //           ...state.values[elementId],
    //           [name]: value,
    //           is_exclusive: false
    //         }
    //       }
    //     };
    //   }
    // }
    if (type === "DETAIL_FETCH_DATA_SUCCESS") {
      const { values } = payload;
      console.log(values, '<<<');
      return {
        ...state,
        values: { [values.id]: values }
      };
    }
    if (newTableState) {
      return { ...state, ...newTableState };
    } else if (newFilterState) {
      console.log(newFilterState, "<<<<");
      return { ...state, ...newFilterState };
    } else if (newFormState) {
      return { ...state, ...newFormState };
    } else if (newWishState) {
      return { ...state, wish: newWishState };
    }
  }
  return state;
}

// const fields: {};

