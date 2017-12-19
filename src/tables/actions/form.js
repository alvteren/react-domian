export const saveToStore = props => async dispatch => {
  const { id, name, value } = props;
  dispatch({
    type: "FORM_SAVE_TO_STORE",
    payload: { id, name, value }
  });
};
