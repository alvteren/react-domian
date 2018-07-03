import { keyBy, get } from "lodash";

import tableData from "./tableData";
import filterData from "./filterData";
import formData from "./formData";
import wishData from "./wishData";
import validate from "./validate";

import { ENTITIES } from "../../constants";
import Street from "../Field/Street";
import { FORM_FIELDS_FETCH_SUCCESS } from "../actions/crm";

const chips = {
  chips: {},
  selectedChips: {},
  presetsChips: {
    archive: {
      id: "archive",
      label: "Архив",
      searchable: "объекты из архива",
      type: "active",
      value: "N"
    },
    domian: {
      id: "domian",
      label: "Домиан",
      searchable: "объекты домиан",
      type: "company",
      value: 19368
    },
    my: {
      id: "my",
      label: "Мои объекты",
      searchable: "мои объекты",
      type: "user",
      value: "self"
    },
    wish: {
      id: "wish",
      label: "Избранное",
      searchable: "избранные объекты",
      type: "wish",
      value: "Y"
    },
    section_id_137: {
      id: "section_id_137",
      label: "Квартиры",
      searchable: "квартиры",
      type: "section_id",
      value: "137"
    },
    section_id_138: {
      id: "section_id_138",
      label: "Дома",
      searchable: "дома",
      type: "section_id",
      value: "138"
    },
    section_id_139: {
      id: "section_id_139",
      label: "Коммерция",
      searchable: "коммерческая недвижимость, коммерция",
      type: "section_id",
      value: "139"
    },
    section_id_141: {
      id: "section_id_141",
      label: "Участки",
      searchable: "участки",
      type: "section_id",
      value: "141"
    },
    is_real: {
      id: "is_real",
      label: "Реальные",
      searchable: "Реальные",
      type: "is_real",
      value: true
    },
    is_exclusive: {
      id: "is_exclusive",
      label: "Эксклюзивы",
      searchable: "Эксклюзивы эксклюзивные",
      type: "is_exclusive",
      value: true
    }
  }
};

const list = {
  headers: {
    name: {
      id: "name",
      label: "Наименование"
    },
    section_id: {
      id: "section_id",
      label: "Раздел"
    },
    type_deal: {
      id: "type_deal",
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
    date_create: {
      id: "date_create",
      label: "Дата"
    },
    s_flat: {
      id: "s_flat",
      label: "Площадь"
    },
    s_area: {
      id: "s_area",
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
  orderBy: "date_create",
  order: "desc"
};
const fields = {}; // will fetch from API
const form = {
  fieldsSections: {
    main: {
      name: "Основная информация",
      fields: {
        type_deal: true,
        section_id: true,
        type_premises: true,
        type_object: true,
        type_obj_commercia: true,
        type_obj_area: true,
        type_obj_houses: true,
        location: true,
        district: true,
        subdistrict: true,
        street_string: true,
        house_number: true,
        house_number_hidden: true,
        number_corp: true,
        number_office: true,
        price: true,
        currency: true,
        etage: true,
        etage_max: true,
        count_rooms: true,
        s_all: true,
        s_live: true,
        s_kitchen: true,
        s_area: true,
        description: true,
        video: true
      }
    },
    more: {
      name: "Подробнее",
      fields: {
        photo: true,
        condition_object: true,
        type_material: true,
        wall_material: true,
        distance_to_city: true,
        year_build: true,
        wc: true,
        torg: true,
        ipoteka: true,
        balcony: true,
        phone: true,
        security: true,
        gas: true,
        water: true,
        electricity: true,
        canalisation: true,
        internet: true,
        comment: true
      }
    },
    contact: {
      name: "О собственнике",
      fields: {
        contact_name: true,
        contact_phone: true,
        contact_home_phone: true,
        contact_email: true
      }
    },
    serviceInfo: {
      name: "Служебное",
      fields: {
        publish_name: true,
        publish_phone: true,
        is_real: true,
        is_exclusive: true,
        number_contract: true,
        area_number: true
      }
    }
  },
  // values for form of editing
  editValues: {},
  // values for detail card
  detail: {}
};

const filter = {
  fields: {
    type_deal: true,
    section_id: true,
    type_premises: true,
    type_object: true,
    type_obj_commercia: true,
    type_obj_area: true,
    type_obj_houses: true,
    location: true,
    district: true,
    subdistrict: true,
    street_string: true,
    price: true,
    etage: true,
    s_all: true,
    s_live: true,
    s_kitchen: true,
    s_area: true,
    date_create: true
  },
  open: false,
  values: {}
};
const rightTools = {
  search: {
    id: "search",
    title: "Поиск"
  },
  filter: {
    id: "filter",
    title: "Фильтр"
  }
};

export const formFields = {
  ...form.fieldsSections.main.fields,
  ...form.fieldsSections.more.fields,
  ...form.fieldsSections.contact.fields,
  ...form.fieldsSections.serviceInfo.fields
};

export const initialState = {
  ...chips,
  ...list,
  ...form,
  fields,
  rightTools,
  formFields,
  filter,
  wish: {},
  loading: {
    card: false,
    form: false,
    chips: false,
    data: true
  }
};

export default (state = initialState, { type, payload }) => {
  const entityId = get(payload, "entityId", null);

  if (entityId === ENTITIES.sale) {
    const newTableState = tableData(state, { type, payload });
    const newFilterState = filterData(state, { type, payload });
    const newFormState = formData(state, { type, payload });
    const newWishState = wishData(state, { type, payload });
    const newValidateState = validate(state, { type, payload });

    if (type === "FORM_SAVE_TO_STORE") {
      const { name, value, elementId } = payload;
      if (name === "is_real" && value === false) {
        return {
          ...state,
          values: {
            ...state.values,
            [elementId]: {
              ...state.values[elementId],
              [name]: value,
              is_exclusive: false
            }
          }
        };
      }
    }
    if (type === "DETAIL_FETCH_DATA_SUCCESS") {
      const { values } = payload;
      return {
        ...state,
        values: { [values.id]: values }
      };
    }

    let newState = { ...state };

    if (newTableState) {
      newState = { ...newState, ...newTableState };
    }
    if (newFilterState) {
      newState = { ...newState, ...newFilterState };
    }
    if (newFormState) {
      if (type === FORM_FIELDS_FETCH_SUCCESS) {
        const { street_string: fieldStreet } = newFormState.fields;

        newFormState.fields.street_string = {
          ...fieldStreet,
          type: "custom",
          component: Street
        };
      }
      newState = { ...newState, ...newFormState };
    }
    if (newValidateState) {
      newState = { ...newState, ...newValidateState };
    }
    if (newWishState) {
      newState = { ...newState, wish: newWishState };
    }

    return newState;
  }
  return state;
};
