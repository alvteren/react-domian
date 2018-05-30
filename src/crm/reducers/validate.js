import * as typeActions from "../actions/validate";

export default (state, { type, payload }) => {
  let newState = null;
  if (state) {

    if (type === "VALIDATE_FIELD_FAIL") {
      const { elementId, error } = payload;
      newState = {
        ...state,
        validate: {
          ...state.validate,
          [elementId]: error
        }
      };
    }

    if (type === "VALIDATE_CLEAR_FORM_FIELDS") {
      const { elementId } = payload;
      newState = {
        ...state,
        validate: {}
      };
    }

    if (type === typeActions.VALIDATE_FORM_SUBMIT) {
      const { elementId } = payload;
      newState = {
        ...state,
        submit: {
          [elementId]: true
        }
      };
    }

    if (type === typeActions.VALIDATE_SUBMIT_CLEAR) {
      newState = {
        ...state,
        submit: {}
      };
    }

    if (type === typeActions.VALIDATE_SET_FORM_ERRORS) {
      const { elementId, validateErrors } = payload;
      newState = {
        ...state,
        validation: {
          [elementId]: {
            validateErrors
          }
        }
      };
    }
  }

  return newState;
}