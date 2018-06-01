export const VALIDATE_SET_FORM_ERRORS = "VALIDATE_SET_FORM_ERRORS";
export const VALIDATE_FORM_SUBMIT = "VALIDATE_FORM_SUBMIT";
export const VALIDATE_SUBMIT_CLEAR = "VALIDATE_SUBMIT_CLEAR";

export const formSubmit = props => dispatch => {
  const { entityId, elementId } = props;
  dispatch({ type: VALIDATE_FORM_SUBMIT, payload: { entityId, elementId }});
};

export const formSubmitClear = props => dispatch => {
  const { entityId } = props;
  dispatch({ type: VALIDATE_SUBMIT_CLEAR, payload: { entityId }});
};

export const validateFormError = props => dispatch => {
  const { entityId, elementId, errors } = props;
  dispatch({
    type: VALIDATE_SET_FORM_ERRORS,
    payload: { entityId, elementId, errors }
  });
};
