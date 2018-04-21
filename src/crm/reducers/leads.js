import { get, keyBy } from "lodash";
import wishData from "./wishData";
import tableData from "./tableData";
import formData from "./formData";
import filterData from "./filterData";

import DistrictInput from "../Field/DistrictTemplate";

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
      label: "Мои депозиты"
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
      label: "Пожелания"
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
        opened: true,
        email: true
      }
    },
    more: {
      name: "Подробнее",
      fields: {
        uf_type_deal: true,
        uf_crm_type_realty: true,
        uf_location: true,
        uf_crm_district_all: true,
        district: true,
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

const fields = {}; // will be fetched from API

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
  if (id === "leads") {
    const newTableState = tableData(state, { type, payload });
    const newFilterState = filterData(state, { type, payload });
    const newFormState = formData(state, { type, payload });
    const newWishState = wishData(state, { type, payload });

    if (type === "DETAIL_FETCH_DATA_SUCCESS") {
      const { values } = payload;
      values.can.edit = true;
      return {
        ...state,
        values: { [values.id]: values }
      };
    }
    if (newTableState) {
      return { ...state, ...newTableState };
    } else if (newFilterState) {
      return { ...state, ...newFilterState };
    } else if (newFormState) {
      if (type === "FORM_FIELDS_FETCH_SUCCESS") {
        newFormState.fields["district"] = {
          id: "district",
          type: "custom",
          component: DistrictInput,
          label: "Районы",
          // depended: "uf_crm_district_all",
          link: [false]
        };
      }
      return {
        ...state,
        ...newFormState
      };
    } else if (newWishState) {
      return { ...state, wish: newWishState };
    }
  }
  return state;
}
