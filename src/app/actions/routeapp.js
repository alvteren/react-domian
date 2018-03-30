export const updateParams = props => dispatch => {
  dispatch({ type: "ROUTE_APP_UPDATE_PARAMS", payload: props });
};
