import * as typeActions from "../actions/validate";
import formValidate from "../../util/formValidate";
import { FORM_SAVE_TO_SERVER_START } from "../actions/crm";
import { get } from "lodash";

export default (state, { type, payload }) => {
  let newState = null;
  if (state) {
    if (type === typeActions.VALIDATE_FORM_SUBMIT) {
      const { entityId, elementId } = payload;
      const form = get(state, `values.${elementId}`, null);
      const fields = get(state, "fields");
      const validateErrors = formValidate({ form, fields, entityId });
      if (validateErrors)
        throw { action: typeActions.VALIDATE_SET_FORM_ERRORS, validateErrors };
      newState = {
        ...state,
        validity: {
          ...state.validity,
          [elementId]: {
            submit: true
          }
        }
      };
    }

    if (type === typeActions.VALIDATE_SUBMIT_CLEAR) {
      const { elementId } = payload;

      newState = {
        ...state,
        validity: {
          ...state.validity,
          [elementId]: {
            submit: false
          }
        }
      };
    }

    if (type === typeActions.VALIDATE_SET_FORM_ERRORS) {
      const { elementId, validateErrors } = payload;
      newState = {
        ...state,
        validity: {
          [elementId]: {
            validateErrors
          }
        }
      };
    }
  }

  return newState;
};
