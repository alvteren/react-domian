export const ACTIVE_TOOL = "ACTIVE_TOOL";

export const activeTool = props => dispatch => {
  const { entityId, toolId } = props;

  dispatch({
    type: "ACTIVE_TOOL",
    payload: { entityId, toolId }
  });
};
