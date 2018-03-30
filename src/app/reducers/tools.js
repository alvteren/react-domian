import { reduce } from "lodash";

const initialState = {
  objects: {
    search: {
      active: false,
      loading: false
    },
    filter: {
      active: false,
      loading: false
    }
  }
};

export default (state = initialState, { type, payload }) => {
  if (type === "ACTIVE_TOOL") {
    const { toolId, entity } = payload;
    const newState = reduce(
      state[entity],
      (result, arTool, key) => {
        return {
          ...result,
          [key]: { ...arTool, active: key === toolId }
        };
      },
      {}
    );
    return { ...state, [entity]: newState };
  }
  if (type === "DEACTIVED_TOOL") {
    const { toolId, entity } = payload;
    const newState = {
      ...state[entity],
      [toolId]: { ...state[entity][toolId], active: false }
    };

    return {
      ...state,
      [entity]: newState
    };
  }
  if (type === "LOADING_TOOL") {
    const { toolId, entity } = payload;
    const newState = {
      ...state[entity],
      [toolId]: { ...state[entity][toolId], loading: true }
    };

    return {
      ...state,
      [entity]: newState
    };
  }
  if (type === "LOADED_TOOL") {
    const { toolId, entity } = payload;
    const newState = {
      ...state[entity],
      [toolId]: { ...state[entity][toolId], loading: false }
    };

    return {
      ...state,
      [entity]: newState
    };
  }

  return state;
};
