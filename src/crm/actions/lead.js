import {
  fetchList,
  fetchDetail,
  fetchFields,
  deleteElement
} from "../../api/crm";
import convert from "../../util/leadDataConverter";
import { setTypeByID } from "../Field/District/districtTreeConverter";

// Action types

export const fetchLeads = props => async dispatch => {
  const { filter, page, rowsPerPage, orderBy, order } = props;
  try {
    dispatch({
      type: "TABLE_FETCH_DATA_START",
      payload: { entityId: "lead" }
    });
    const data = await fetchList({
      entityId: "lead",
      filter,
      limit: [page * rowsPerPage, rowsPerPage],
      orderBy,
      order
    });
    convert(data);
    dispatch({
      type: "TABLE_FETCH_DATA_SUCCESS",
      payload: { entityId: "lead", ...data }
    });
  } catch (err) {
    dispatch({ type: "TABLE_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const fetchLead = id => async dispatch => {
  try {
    dispatch({
      type: "DETAIL_FETCH_DATA_START",
      payload: { entityId: "lead" }
    });
    const data = await fetchDetail({ id });
    dispatch({
      type: "DETAIL_FETCH_DATA_SUCCESS",
      payload: { entityId: "lead", ...data }
    });
  } catch (err) {
    dispatch({ type: "DETAIL_FETCH_DATA_ERROR", payload: err, error: true });
  }
};
export const onInitLead = props => async dispatch => {
  const { elementId } = props;
  dispatch({
    type: "DETAIL_INIT",
    payload: { entityId: "lead", current: elementId }
  });
};

export const fetchLeadFields = () => async dispatch => {
  try {
    dispatch({
      type: "FORM_FIELDS_FETCH_START",
      payload: { id: "lead" }
    });
    const data = await fetchFields({ entityId: "lead" });
    setTypeByID(data);
    dispatch({
      type: "FORM_FIELDS_FETCH_SUCCESS",
      payload: { id: "lead", data }
    });
  } catch (err) {
    dispatch({ type: "FORM_FIELDS_FETCH_ERROR", payload: err, error: true });
  }
};
