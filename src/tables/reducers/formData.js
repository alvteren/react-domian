import { omit, keyBy } from "lodash";
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
      const newFieldState = { [name]: { ...state.fields[name], value } };
      newstate = {
        ...state,
        fields: { ...state.fields, ...newFieldState }
      };
    }
  }
  if (newstate) {
    return { ...state, ...newstate };
  }

  return null;
};
