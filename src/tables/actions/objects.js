import { fetchObjects as fetchObjectsApi } from "../../api";

const fetchObjects = ({ filter, offset }) => async dispatch => {
  try {
    dispatch({ type: "FETCH_OBJECTS_START" });
    const objects = await fetchObjectsApi({ filter, offset });
    dispatch({ type: "FETCH_OBJECTS_SUCCESS", payload: objects });
  } catch (err) {
    dispatch({ type: "FETCH_OBJECTS_ERROR", payload: err, error: true });
  }
};
export default fetchObjects;
