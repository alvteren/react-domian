export const deletePhoto = props => dispatch => {
  dispatch({ type: "DELETE_PHOTO", payload: props });
};
