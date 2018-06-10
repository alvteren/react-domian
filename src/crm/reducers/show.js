import * as crmActions from "../actions/crm";
import * as showActions from "../actions/show";
import { getTomorrowDate, convertDateForMui } from "../../util/dateConverter";
import { keyBy, omit, toArray, get } from "lodash";
import {ENTITIES} from "../../constants";

export const fields = {
  date: {
    id: "date",
    label: "Дата показа",
    type: "date",
    required: true
  },
  uf_crm_type_realty: {
    id: "uf_crm_type_realty",
    label: "Тип недвижимости",
    type: "custom",
    items: []
  },
  section: {},
  street: {
    id: "street",
    label: "Улица",
    type: "custom"
  },
  address: {
    id: "address",
    label: "Номер дома/участка",
    type: "text",
    // required: true // ?
  },
  price: {
    id: "price",
    label: "Цена",
    type: "number"
  },
  comment: {
    id: "comment",
    label: "Комментарий",
    type: "textarea"
  }
};

const form = {
  date: true,
  objects: [
    {
      uf_crm_type_realty: true,
      street: true,
      address: true,
      price: true,
      comment: true
    }
  ],
};

const dateFields = [];
toArray(fields).forEach((item, index) => {
  if (item.type === "date") dateFields.push(item.id);
});

const defaultValues = {
  date: getTomorrowDate(),
  objects: []
};

export const object = {
  uf_crm_type_realty: "",
  street: "",
  address: "",
  price: "",
  comment: ""
};

const values = {
  // default props for new instance
  0: defaultValues
};

const initialState = {
  fields,
  values,
  form
};

export default function reducer (state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);

  if (entityId === ENTITIES.show) {
    if (type === showActions.SHOW_ADD_NEW_OBJECT) {
      const { showId } = payload;

      return {
        ...state,
        values: {
          ...values,
          [showId]: {
            ...state.values[showId],
            objects: [...state.values[showId], object]
          }
        }
      }
    }
  }

  if (type === "TABLE_FETCH_DATA_SUCCESS") {
    const items = get(payload, "data", {});
    const values = {};

    if (items) {
      Object.keys(items).forEach((key) => {
        if (items[key].shows) {
          for (let showId in items[key].shows) {
            values[showId] = items[key].shows[showId];
            values[showId].can = { edit: true };

            /* Date fields convert for Mui */
            dateFields.forEach((field) => {
              values[showId][field] = items[key].shows[showId][field] ?
                convertDateForMui(items[key].shows[showId][field]) :
                getTomorrowDate();
            });
          }
        }
      });
    }
    return {
      ...state,
      values: {
        ...state.values,
        ...values
      }
    }
  }

  if (entityId === ENTITIES.lead && type === crmActions.FORM_FIELDS_FETCH_SUCCESS) {
    /* update fields with server data */
      let newState = null;
    const uf_crm_type_realty = get(payload, "data.uf_crm_type_realty", null);
    const section = get (payload, "data.section", null);

      if (uf_crm_type_realty) {
        newState = {
            ...state,
            fields: {
              ...state.fields,
              uf_crm_type_realty
            }
        }
      }

      if (section) {
        newState = {
            ...state,
            fields: {
              ...state.fields,
              section
            }
        }
      }

      if (newState) return newState;
    }

  return state;
};


/* exported state to another reducers */
export const showData = (state, { type, payload }) => {
  let newState = null;
};