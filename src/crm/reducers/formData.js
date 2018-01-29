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
      const { name, value } = payload;
      const newValuesState = { [name]: value };
      newstate = {
        ...state,
        values: { ...state.values, ...newValuesState }
      };
    }
  }
  if (newstate) {
    return { ...state, ...newstate };
  }

  return null;
};
