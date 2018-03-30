export const activeTool = props => dispatch => {
  dispatch({ type: "ACTIVE_TOOL", payload: props });
};
export const deactivedTool = props => dispatch => {
  dispatch({ type: "DEACTIVED_TOOL", payload: props });
};
export const loadingTool = props => dispatch => {
  dispatch({ type: "LOADING_TOOL", payload: props });
};
export const loadedTool = props => dispatch => {
  dispatch({ type: "LOADED_TOOL", payload: props });
};
