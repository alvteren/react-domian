export default function reducer(state = initialState, { type, payload }) {
  const { entityId, elementId } = payload;

  if (type === "SET_VALIDATE_ERRORS") {
    const { validateErrors } = payload;
    return {
      ...state,
      [entityId]: {
        ...state[entityId],
        [elementId]: {
          ...state[entityId][elementId],
          ...validateErrors
        }
      }
    }
  }
}