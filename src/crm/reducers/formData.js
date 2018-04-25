import { keyBy, omit, toArray, get } from "lodash";
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
      const oldValues = get(state.values, elementId, {});
      newstate = {
        ...state,
        values: {
          ...state.values,
          [elementId]: {
            ...oldValues,
            [name]: value
          }
        }
      };
    }
    if (type === "FORM_SAVE_FILE") {
      const { name, value, elementId } = payload;
      const oldValues = get(state.values, elementId, {});
      const oldFiles = get(oldValues, name, {});
      newstate = {
        ...state,
        values: {
          ...state.values,
          [elementId]: {
            ...oldValues,
            [name]: [...oldFiles, value]
          }
        }
      };
    }
    if (type === "DETAIL_INIT") {
      const { current } = payload;
      newstate = {
        ...state,
        current
      };
    }
    if (type === "DELETE_PHOTO") {
      const { elementId, index } = payload;
      const omitPhotos = omit(state.values[elementId].photo, index);

      newstate = {
        values: {
          ...state.values,
          [elementId]: {
            ...state.values[elementId],
            photo: toArray(omitPhotos)
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
