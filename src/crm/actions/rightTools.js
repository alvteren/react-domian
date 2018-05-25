export const activeTool = props => dispatch => {
  const { entityId, toolId } = props;

  dispatch({
    type: "ACTIVE_TOOL",
    payload: { entityId, toolId }
  });
};
