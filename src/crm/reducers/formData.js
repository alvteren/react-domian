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
    if (type === "SET_INIT_FORM_STATE") {
      const { initState } = payload;
      newstate = {
        ...state,
        values: {
          ...state.values,
          "0": {
            ...initState
          }
        }
      }
    }
    if (type === "FORM_SAVE_TO_STORE") {
      const { name, value, elementId } = payload;
      const oldValues = get(state.values, elementId, {});
      if (Array.isArray(name)) {
        let update = {};
        name.forEach(item => {
          const key = item.name;
          update[key] = item.value;
        });
        newstate = {
          ...state,
          values: {
            ...state.values,
            [elementId]: {
              ...oldValues,
              ...update
            }
          }
        };
      } else {
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
    }
    if (type === "FORM_VALIDATION_ERROR") {
      const { elementId, errorArr } = payload;
      console.log(state);
      newstate = {
        ...state,
        values: {
          ...state.values,
          [elementId]: {
            ...state.values[elementId],
            "validateErrorArr": errorArr
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
    if (type === "DISTRICT_CHANGE") {
      const { districts, subDistricts } = payload;
      newstate = { ...state, uf_crm_district: districts, uf_crm_subdistrict: subDistricts }
    }
  }
  if (newstate) {
    return { ...state, ...newstate };
  }

  return null;
};
