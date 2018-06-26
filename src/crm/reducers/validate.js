import * as typeActions from "../actions/validate";
import formValidate from "../../util/formValidate";
import {get} from "lodash";

export default (state, { type, payload }) => {
  let newState = null;
  if (state) {

    if (type === typeActions.VALIDATE_FORM_SUBMIT) {
      const { child, path } = payload;

      let entityId, elementId;
      if (!child) {
        entityId = payload.entityId;
        elementId = payload.elementId;
        debugger;
      } else {
        entityId = child.entityId;
        elementId = child.elementId;
      }

      const form = get(state, `values.${elementId}`, null);
      const fields = get(state, "fields");
      const validateErrors = formValidate({ form, fields, entityId, path });
      if (validateErrors) throw({ action: typeActions.VALIDATE_SET_FORM_ERRORS, validateErrors });
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
}