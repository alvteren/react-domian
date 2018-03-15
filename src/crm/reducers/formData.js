import { keyBy } from "lodash";
export default (state, { type, payload }) => {
  let newstate = null;
  if (state) {
    if (type === "FORM_FIELDS_FETCH_STARTED") {
      newstate = {
        ...state,
        loading: { ...state.loading, form: true }
      };
    }
    if (type === "FORM_FIELDS_FETCH_SUCCESS") {
      const { data } = payload;
      newstate = {
        ...state,
        fields: keyBy(data, "id"),
        loading: { ...state.loading, form: false }
      };
    }
    if (type === "FORM_SAVE_TO_STORE") {
      const { name, value, elementId } = payload;
      newstate = {
        ...state,
        values: {
          ...state.values,
          [elementId]: {
            ...state.values[elementId],
            [name]: value
          }
        }
      };
    }
    if (type === "FORM_SAVE_FILE") {
      const { name, value, elementId } = payload;
      newstate = {
        ...state,
        values: {
          ...state.values,
          [elementId]: {
            ...state.values[elementId],
            [name]: [...state.values[elementId][name], value]
          }
        }
      };
    }
  }
  if (newstate) {
    return { ...state, ...newstate };
  }

  return null;
};
