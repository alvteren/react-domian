import * as crmActions from "../actions/crm";
import * as showActions from "../actions/show";
import validateData from "./validate";
import { getTomorrowDate, convertDateForMui } from "../../util/dateConverter";
import { keyBy, omit, toArray, get } from "lodash";
import TypeRealtyInput from "../Field/TypeRealty";
import Street from "../Field/Street";
import { FORM_SAVE_TO_STORE } from "../actions/form";
import { ENTITIES } from "../../constants";

const dateType = "date";
export const fields = {
  date: {
    id: "date",
    label: "Дата показа",
    type: "date",
    required: true,
    dateType: dateType
  },
  uf_crm_type_realty: {
    id: "uf_crm_type_realty",
    label: "Тип недвижимости",
    type: "custom",
    required: true,
    items: [],
    component: TypeRealtyInput,
    props: {
      multipleSelect: false
    }
  },
  section: {},
  street: {
    id: "street",
    label: "Улица",
    type: "custom",
    required: true,
    component: Street
  },
  address: {
    id: "address",
    label: "Номер дома/участка",
    type: "text"
    // required: true // ?
  },
  price: {
    id: "price",
    label: "Цена",
    type: "number",
    required: true,
  },
  comment: {
    id: "comment",
    label: "Комментарий",
    type: "textarea"
  }
};

export const formFields =  {
  date: true,
  items: [
    {
      uf_crm_type_realty: true,
      street: true,
      address: true,
      price: true,
      comment: true
    }
  ]
};

const dateFields = [];
toArray(fields).forEach((item, index) => {
  if (item.type === "date") dateFields.push(item.id);
});

const defaultValues = {
  date: getTomorrowDate(dateType),
  items: []
};

export const object = {
  uf_crm_type_realty: [],
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
  form: formFields,
  current: null
};

export default function reducer(state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);

  if (entityId === ENTITIES.show) {
    const newValidateData = validateData(state, { type, payload: { ...payload, path: "items" }});

    if (type === showActions.SHOW_ADD_NEW_OBJECT) {
      const { elementId } = payload;

      return {
        ...state,
        values: {
          ...values,
          [elementId]: {
            ...state.values[elementId],
            items: [...state.values[elementId].items, object]
          }
        }
      };
    }

    if (type === showActions.SHOW_SET_CURRENT) {
      const { elementId, location } = payload;
      if (elementId === null) {
        return {
          ...state,
          current: elementId
        };
      }
      return {
        ...state,
        values: {
          ...state.values,
          [elementId]: { ...state.values[elementId], location }
        },
        current: elementId
      };
    }

    if (type === FORM_SAVE_TO_STORE) {
      const { name, value, elementId, entityId } = payload;
      if (entityId === ENTITIES.show) {
        // For show if we want to save some items (objects) prop we pass index of object we want to modify
        // else it should be a common show's date
        const { index } = payload;
        if (!index && name === "date") {
          const oldValues = get(state.values, elementId, {});
          return {
            ...state,
            values: {
              ...state.values,
              [elementId]: {
                ...oldValues,
                date: value
              }
            }
          };
        }

        const oldValues = get(state.values, `${elementId}.items`, {});

        const newValues = oldValues.splice(0); // copy of items Array
        newValues[index][name] = value;
        return {
          ...state,
          values: {
            ...state.values,
            [elementId]: {
              ...state.values[elementId],
              items: newValues
            }
          }
        };
      }
    }

    if (type === showActions.SHOW_SET_EDITED) {
      const { elementId } = payload;

      return {
        ...state,
        edited: {
          ...state.edited,
          [elementId]: true
        }
      }
    }

    if (newValidateData) {
      return {
        ...state,
        ...newValidateData
      }
    }
  }

  if (entityId === ENTITIES.lead && type === "TABLE_FETCH_DATA_SUCCESS") {
    const items = get(payload, "data", {});
    let values;

    if (items) {
      values = Object.keys(items).reduce((accumulator, key, currentIndex, array) => {
        for (let showId in items[key].shows) {
          accumulator[showId] = items[key].shows[showId];
          accumulator[showId].can = { edit: true };

          /* Date fields convert for Mui */
          dateFields.forEach((field) => {
            accumulator[showId][field] = items[key].shows[showId][field] ?
              convertDateForMui(items[key].shows[showId][field], dateType) :
              getTomorrowDate(dateType);
          });
        }
        return accumulator;
      }, {});
    }

    return {
      ...state,
      values: {
        ...state.values,
        ...values
      }
    }
  }

  if (
    entityId === ENTITIES.lead &&
    type === crmActions.FORM_FIELDS_FETCH_SUCCESS
  ) {
    /* update fields with server data */
    let newState = null;
    const uf_crm_type_realty = get(payload, "data.uf_crm_type_realty", null);
    const section = get(payload, "data.section", null);

    if (uf_crm_type_realty && section) {
      newState = {
        ...state,
        fields: {
          ...state.fields,
          uf_crm_type_realty: {
            ...state.fields.uf_crm_type_realty,
            items: uf_crm_type_realty.items
          },
          section
        }
      };
    }
    if (newState) return newState;
  }

  return state;
}

/* exported state to another reducers */
export const showData = (state, { type, payload }) => {
  let newState = null;
};
