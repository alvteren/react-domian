const initialState = "";

export default function filterObjects(state = initialState, action) {
  if (action.type === "FIND_OBJECT") {
    return action.payload;
  }
  return state;
}
