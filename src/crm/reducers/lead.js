import { get } from "lodash";
import wishData from "./wishData";
import tableData from "./tableData";
import formData from "./formData";
import filterData from "./filterData";
import validate from "./validate";
import convert from "../../util/leadDataConverter";

import DistrictInput from "../Field/District";
import TypeRealtyInput from "../Field/TypeRealty";

import { ENTITIES } from "../../constants";

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
    },
    favorites: {
      id: "wishes",
      label: "Избранное"
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
        email: true,
        phone: true
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
        uf_source: true,
        uf_currency: true
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
// validateErrorArr prop will be contain info about invalid fields before save to server

export const formFields = {
  ...form.fieldsSections.main.fields,
  ...form.fieldsSections.more.fields
};
// validateErrorArr prop will be contain info about invalid fields before save to server

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
  },
  validity: {}
};

export default function reducer(state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);
  if (entityId === ENTITIES.lead) {
    const newTableState = tableData(state, { type, payload });
    const newFilterState = filterData(state, { type, payload });
    const newFormState = formData(state, { type, payload });
    const newWishState = wishData(state, { type, payload });
    const newValidateState = validate(state, { type, payload });

    if (type === "DETAIL_FETCH_DATA_SUCCESS") {
      const { values } = payload;
      // values.can.edit = true; // for testing
      return {
        ...state,
        values: { [values.id]: values }
      };
    }

    if (type === "FORM_SAVE_TO_STORE") {
      // const { name, value, elementId } = payload;
    }

    if (type === "REMINDER_ADD_SUCCESS") {
      const { elementId, reminder, id } = payload;
      const fullID = `${ENTITIES.lead}_${elementId}`;
      debugger;
      return {
        ...state,
        data: {
          ...state.data,
          [fullID]: {
            ...state.data[fullID],
            reminders: {
              ...state.data[fullID].reminders,
              [id]: reminder
            }
          }
        }
      }
    }

    if (type === "REMINDER_UPDATE_SUCCESS") {
      const { elementId, reminderId, reminder } = payload;
      const fullID = `${ENTITIES.lead}_${elementId}`;
      return {
        ...state,
        data: {
          ...state.data,
          [fullID]: {
            ...state.data[fullID],
            reminders: {
              ...state.data[fullID].reminders,
              [reminderId]: reminder
            }
          }
        }
      }
    }

    if (newTableState) {
      if (type === "TABLE_FETCH_DATA_SUCCESS") {
        convert(newTableState.data);
      }
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
          depended: "uf_crm_district_all",
          link: [false]
        };
        newFormState.fields["uf_crm_type_realty"] = {
          ...newFormState.fields["uf_crm_type_realty"],
          ...{
            id: "uf_crm_type_realty",
            type: "custom",
            component: TypeRealtyInput,
            label: "Тип недвижимости",
            depended: null
          }
        };
      }
      return {
        ...state,
        ...newFormState
      };
    } else if (newWishState) {
      return { ...state, wish: newWishState };
    } else if (newValidateState) {
      return { ...newValidateState }
    }
  }
  return state;
}
