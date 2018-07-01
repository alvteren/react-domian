import * as crmActions from "../actions/crm";
import * as showActions from "../actions/show";
import validateData from "./validate";
import { getTomorrowDate, convertDateForMui } from "../../util/dateConverter";
import { keyBy, omit, toArray, get, cloneDeep } from "lodash";
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

export const showRules = {
  rules: {},
  excludeValidationProps: ["location", "can"]
};

const initialState = {
  fields,
  values,
  validity: {},
  // form: formFields,
  current: null
};

export default function reducer(state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);

  if (entityId === ENTITIES.show) {
    const newValidateData = validateData(state, { type, payload: { ...payload, path: "items" }});

    if (type === showActions.SHOW_ADD_NEW_OBJECT) {
      const { showId } = payload;
      const newEmptyItem = Object.assign({}, object);

      return {
        ...state,
        values: {
          ...values,
          [showId]: {
            ...state.values[showId],
            items: [...state.values[showId].items, newEmptyItem]
          }
        }
      };
    }

    if (type === showActions.SHOW_SET_CURRENT) {
      const { showId, location } = payload;
      if (showId === null) {
        return {
          ...state,
          current: showId
        };
      }
      return {
        ...state,
        values: {
          ...state.values,
          [showId]: { ...state.values[showId], location }
        },
        current: showId
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
      const { showId } = payload;

      return {
        ...state,
        edited: {
          ...state.edited,
          [showId]: true
        }
      }
    }

    if (type === showActions.SHOW_PREPARE_FOR_VALIDATE) {
      const { showId } = payload;

      /* removing empty items before validation */
      const filteredItems = state.values[showId].items.filter(item => {
        /* try to save if at least one prop is filled */
        return Object.keys(item).some(key => {
          return Boolean(item[key].length)
        });
      });

      if (!filteredItems.length) {
        throw({ action: showActions.SHOW_EMPTY_ITEMS_SAVE, payload: { showId }});
      }

      return {
        ...state,
        values: {
          ...state.values,
          [showId]: {
            ...state.values[showId],
            items: filteredItems
          }
        },
        validity: {
          ...state.validity,
          emptyItems: false
        }
      }
    }

    if (type === showActions.SHOW_EMPTY_ITEMS_SAVE) {
      const { elementId } = payload;

      return {
        ...state,
        validity: {
          ...state.validity,
          [elementId]: {
            ...state.validity[elementId],
            emptyItems: true
          }
        }
      }
    }

    if (type === showActions.SHOW_ADD_ERROR) {
      console.error(`${showActions.SHOW_ADD_ERROR} ERROR`, payload);
    }

    /* Below handles outer module actions */

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
