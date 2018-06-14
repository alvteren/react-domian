import * as crmActions from "../actions/crm";
import * as showActions from "../actions/show";
import { getTomorrowDate, convertDateForMui } from "../../util/dateConverter";
import { keyBy, omit, toArray, get } from "lodash";
import TypeRealtyInput from "../Field/TypeRealty";
import Street from "../Field/Street";
import { FORM_SAVE_TO_STORE } from "../actions/form";
import { ENTITIES } from "../../constants";

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
  ]
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
  form,
  current: null
};

export default function reducer(state = initialState, { type, payload }) {
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
            objects: [...state.values[showId].objects, object]
          }
        }
      };
    }

    if (type === showActions.SHOW_SET_CURRENT) {
      const { showId, location } = payload;
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
        // For show if we want to save some objects prop we pass index of object we want to modify
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

        const oldValues = get(state.values, `${elementId}.objects`, {});

        const newValues = oldValues.splice(0); // copy of objects Array
        newValues[index][name] = value;
        return {
          ...state,
          values: {
            ...state.values,
            [elementId]: {
              ...state.values[elementId],
              objects: newValues
            }
          }
        };
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
              convertDateForMui(items[key].shows[showId][field]) :
              getTomorrowDate();
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
