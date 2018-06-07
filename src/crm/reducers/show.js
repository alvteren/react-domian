import * as crmActions from "../actions/crm";
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
  street_string: {
    id: "street_string",
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

const dateFields = [];
toArray(fields).forEach((item, index) => {
  if (item.type === "date") dateFields.push(item.id);
});

const defaultValues = {
  date: getTomorrowDate(),
  uf_crm_type_realty: "",
  street_string: "",
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
  values
};

export default function reducer (state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);

  if (entityId === ENTITIES.show) {

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
    const uf_crm_type_realty = get(payload, "data", null);
    const street_string = get (payload, "data", null);

    if (uf_crm_type_realty) {
      newState = {
        ...state,
        fields: {
          ...state.fields,
          uf_crm_type_realty
        }
      }
    }

    if (street_string) {
      newState = {
        ...state,
        fields: {
          ...state.fields,
          street_string
        }
      }
    }

    if (newState) return newState;
  }
};


/* exported state to another reducers */
export const showData = (state, { type, payload }) => {
  let newState = null;
};