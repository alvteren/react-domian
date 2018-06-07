import { keyBy, get } from "lodash";

import tableData from "./tableData";
import filterData from "./filterData";
import formData from "./formData";
import wishData from "./wishData";

import { ENTITIES } from "../../constants";
import Street from "../Field/Street";

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
const fields = {
  type_deal: {
    type: "select",
    label: "Тип сделки",
    required: true,
    items: {}
  },
  section_id: {
    type: "select",
    label: "Раздел",
    value: "",
    required: true,
    items: {}
  },
  district: {
    type: "select",
    label: "Район",
    value: "",
    required: true,
    items: {}
  },
  subdistrict: {
    type: "select",
    depended: "district",
    label: "Подрайон",
    value: "",
    required: true,
    items: {}
  },
  s_all: {
    type: "text",
    label: "Площадь общая",
    value: "",
    required: true
  },
  s_flat: {
    type: "text",
    label: "Площадь",
    value: "",
    required: true
  },
  s_live: {
    type: "text",
    label: "Площадь жилая",
    value: "",
    required: true
  },
  s_kitchen: {
    type: "text",
    label: "Площадь кухни",
    value: "",
    required: true
  },
  s_area: {
    type: "text",
    label: "Площадь участка",
    value: "",
    required: true
  },
  contact_name: {
    type: "text",
    label: "Контактное лицо",
    value: "",
    hint: "Поле отображается только Вам",
    required: true
  },
  contact_phone: {
    type: "text",
    label: "Контактный телефон",
    value: "",
    hint: "Поле отображается только Вам",
    required: true
  },
  contact_home_phone: {
    type: "text",
    label: "Дом. телефон",
    hint: "Поле отображается только Вам",
    value: ""
  },
  contact_email: {
    type: "text",
    label: "E-mail",
    hint: "Поле отображается только Вам",
    value: ""
  },
  publish_name: {
    type: "text",
    label: "Имя для выгрузки",
    value: "",
    required: true
  },
  publish_phone: {
    type: "text",
    label: "Телефон для выгрузки",
    value: "",
    required: true
  },
  is_real: {
    type: "switch",
    label: "Реальный объект",
    value: false
  },
  is_exclusive: {
    type: "switch",
    depended: "is_real",
    link: true,
    label: "Эксклюзив",
    value: false
  },
  number_contract: {
    type: "text",
    label: "Номер договора",
    depended: "is_exclusive",
    link: true,
    value: "",
    required: true
  },
  area_number: {
    type: "text",
    label: "Кадастровый номер",
    hint: "Выгружается на внешние площадки",
    value: ""
  }
};
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
  detail: {},
  filterFields: {
    type_apartment: null,
    type_deal: null,
    section_id: null,
    district: null,
    subdistrict: null
  }
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
  filter: {},
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

    if (newTableState) {
      return { ...state, ...newTableState };
    } else if (newFilterState) {
      return { ...state, ...newFilterState };
    } else if (newFormState) {
      if (type === "FORM_FIELDS_FETCH_SUCCESS") {
        const { street_string: fieldStreet } = newFormState.fields;

        newFormState.fields.street_string = {
          ...fieldStreet,
          type: "custom",
          component: Street
        };
      }
      return { ...state, ...newFormState };
    } else if (newWishState) {
      return { ...state, wish: newWishState };
    }
  }
  return state;
};
