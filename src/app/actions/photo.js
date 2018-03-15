export const showPhotoBig = props => dispatch => {
  dispatch({ type: "SHOW_BIG_PHOTO", payload: props });
};
export const hidePhotoBig = props => dispatch => {
  dispatch({ type: "HIDE_BIG_PHOTO" });
};
