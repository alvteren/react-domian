export const activeTool = toolId => dispatch => {
  dispatch({
    type: "ACTIVE_TOOL",
    payload: { entity: "objects", toolId }
  });
};
