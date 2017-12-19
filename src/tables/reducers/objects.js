import { keyBy, get } from "lodash";

import tableData from "./tableData";
import filterData from "./filterData";
import formData from "./formData";

const chips = {
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
  }
};

const list = {
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
  order: "desc"
};

const form = {
  fields: {
    type_deal: {
      type: "select",
      label: "Тип сделки",
      value: "rent",
      hint: "test",
      required: true,
      items: {
        rent: {
          value: "rent",
          label: "Аренда"
        },
        sale: {
          value: "sale",
          label: "Продажа"
        }
      }
    },
    section: {
      type: "select",
      label: "Раздел",
      value: "apartments",
      required: true,
      items: {
        apartments: {
          value: "apartments",
          label: "Квартиры"
        },
        homes: {
          value: "sale",
          label: "Дома"
        },
        areas: {
          value: "areas",
          label: "Участки"
        },
        commercia: {
          value: "commercia",
          label: "Коммерция"
        }
      }
    },
    type_apartment: {
      type: "select",
      label: "Тип квартиры",
      value: "rooms1",
      required: true,
      items: {
        guest: {
          value: "guest",
          label: "Гостинка"
        },
        room: {
          value: "room",
          label: "Комната"
        },
        studio: {
          value: "studio",
          label: "Студия"
        },
        rooms1: {
          value: "rooms1",
          label: "Однокомнатная"
        },
        rooms2: {
          value: "rooms2",
          label: "Двухкомнатная"
        },
        rooms3: {
          value: "rooms3",
          label: "Трехкомнатная"
        },
        rooms4: {
          value: "rooms4",
          label: "Четырехкомнатная"
        },
        rooms5: {
          value: "rooms5",
          label: "Пятикомнатная и более"
        }
      }
    },
    type_realty: {
      type: "select",
      label: "Тип недвижимости",
      value: "",
      required: true,
      items: {
        second: {
          value: "second",
          label: "Вторичка"
        },
        newbuilding: {
          value: "newbuilding",
          label: "Новостройка"
        },
        newbuilding_part: {
          value: "newbuilding_part",
          label: "Новостройка Дольщик"
        }
      }
    },
    district: {
      type: "select",
      label: "Район",
      value: "",
      required: true,
      items: {
        district_1: {
          value: "district_1",
          label: "Район1"
        },
        district_2: {
          value: "district_2",
          label: "Район2"
        },
        district_3: {
          value: "district_3",
          label: "Район3"
        }
      }
    },
    subdistrict: {
      type: "select",
      depended: "district",
      label: "Подрайон",
      value: "",
      required: true,
      items: {
        second: {
          link: "district_1",
          value: "second",
          label: "Подрайон1"
        },
        newbuilding: {
          link: "district_1",
          value: "newbuilding",
          label: "Подрайон2"
        },
        newbuilding_part: {
          link: "district_2",
          value: "newbuilding_part",
          label: "Подрайон3"
        }
      }
    },
    s_all: {
      type: "text",
      label: "Площадь общая",
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
  },
  fieldsSections: {
    main: {
      name: "Основная информация",
      fields: {
        type_deal: true,
        section: true,
        type_apartment: true,
        type_realty: true,
        district: true,
        subdistrict: true
      }
    },
    more: {
      name: "Подробнее",
      fields: {
        s_all: true,
        s_live: true,
        s_kitchen: true,
        s_area: true
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
  }
};

export const initialState = {
  ...chips,
  ...list,
  ...form,
  filter: {},
  cacheQuery: [],
  loading: {
    form: false,
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
    const newFormState = formData(state, { type, payload });

    if (type === "FORM_SAVE_TO_STORE") {
      const { name, value } = payload;

      if (name === "is_real" && value === false) {
        const newFieldState = {
          is_real: { ...state.fields.is_real, value: false },
          is_exclusive: { ...state.fields.is_exclusive, value: false }
        };
        return {
          ...state,
          fields: { ...state.fields, ...newFieldState }
        };
      }
    }

    if (newTableState) {
      return { ...state, ...newTableState };
    } else if (newFilterState) {
      return { ...state, ...newFilterState };
    } else if (newFormState) {
      return { ...state, ...newFormState };
    }
  }
  return state;
};
