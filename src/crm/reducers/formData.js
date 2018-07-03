import * as crmActions from "../actions/crm";
import * as formActions from "../actions/form";
import { keyBy, omit, toArray, get, size, reduce } from "lodash";
import formValidate from "../../util/formValidate";

export default (state, { type, payload }) => {
  let newstate = null;
  if (state) {
    if (type === crmActions.FORM_FIELDS_FETCH_START) {
      newstate = {
        loading: { ...state.loading, form: true }
      };
    }
    if (type === crmActions.FORM_FIELDS_FETCH_SUCCESS) {
      const { data } = payload;
      newstate = {
        fields: keyBy(data, "id"),
        loading: { ...state.loading, form: false }
      };
    }
    if (type === formActions.SET_INIT_FORM_STATE) {
      const { entityId } = payload;
      const { fields } = state;

      if (!fields || size(fields) === 0) return null;
      const initState = reduce(
        fields,
        (result, field) => {
          const initValue = field.multiple
            ? []
            : field.hasOwnProperty("default")
              ? field.default
              : "";
          return { ...result, [field.id]: initValue };
        },
        {}
      );

      initState.can = { edit: true };

      newstate = {
        values: {
          ...state.values,
          "0": {
            ...initState
          }
        }
      };
    }
    if (type === formActions.FORM_SAVE_TO_STORE) {
      const { name, value, elementId } = payload;
      const oldValues = get(state.values, elementId, {});
      if (Array.isArray(name)) {
        let update = {};
        name.forEach(item => {
          const key = item.name;
          update[key] = item.value;
        });
        newstate = {
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

    if (type === crmActions.FORM_SAVE_TO_SERVER_START) {
      const { entityId, elementId } = payload;
      const form = get(state, `values.${elementId}`, null);
      const { fields } = state;
      const validateErrors = formValidate({ form, fields, entityId });
      if (validateErrors)
        throw {
          action: "VALIDATE_SET_FORM_ERRORS",
          validateErrors,
          entityId,
          elementId
        };
    }

    if (type === crmActions.FORM_SAVE_TO_SERVER_ERROR) {
      const { elementId, key, validateErrors } = payload;
      newstate = {
        validity: {
          ...state.validity,
          [elementId]: {
            validateErrors
          }
        }
      };
    }

    if (type === formActions.FORM_SAVE_FILE) {
      const { name, value, elementId } = payload;
      const oldValues = get(state.values, elementId, {});
      const oldFiles = get(oldValues, name, {});
      newstate = {
        values: {
          ...state.values,
          [elementId]: {
            ...oldValues,
            [name]: [...oldFiles, value]
          }
        }
      };
    }
    if (type === crmActions.DETAIL_INIT) {
      const { current } = payload;
      newstate = {
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
      newstate = {
        uf_crm_district: districts,
        uf_crm_subdistrict: subDistricts
      };
    }
  }
  if (newstate) {
    return newstate;
  }

  return null;
};
