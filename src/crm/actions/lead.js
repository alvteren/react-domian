import { fetchLeads as fetchLeadsApi } from "../../api/lead";
import { fetchLead as fetchLeadApi } from "../../api/lead";
import { fetchLeadFields as fetchLeadFieldsApi } from "../../api/lead";
import { fetchLeadField as fetchLeadFieldApi } from "../../api/lead";
import convert from "../../util/leadDataConverter";
import { setTypeByID } from "../Field/District/districtTreeConverter";

// Action types

export const fetchLeads = props => async dispatch => {
  const { filter, page, rowsPerPage, orderBy, order } = props;
  try {
    dispatch({
      type: "TABLE_FETCH_DATA_START",
      payload: { id: "lead" }
    });
    const data = await fetchLeadsApi({
      filter,
      limit: [page * rowsPerPage, rowsPerPage],
      orderBy,
      order
    });
    convert(data);
    dispatch({
      type: "TABLE_FETCH_DATA_SUCCESS",
      payload: { id: "leads", ...data }
    });
  } catch (err) {
    dispatch({ type: "TABLE_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const fetchLead = id => async dispatch => {
  try {
    dispatch({
      type: "DETAIL_FETCH_DATA_START",
      payload: { id: "leads" }
    });
    const data = await fetchLeadApi({ id });
    dispatch({
      type: "DETAIL_FETCH_DATA_SUCCESS",
      payload: { id: "leads", ...data }
    });
  } catch (err) {
    dispatch({ type: "DETAIL_FETCH_DATA_ERROR", payload: err, error: true });
  }
};
export const onInitLead = props => async dispatch => {
  const { id } = props;
  dispatch({
    type: "DETAIL_INIT",
    payload: { id: "leads", current: id }
  });
};

export const fetchLeadFields = () => async dispatch => {
  try {
    dispatch({
      type: "FORM_FIELDS_FETCH_START",
      payload: { id: "leads" }
    });
    const data = await fetchLeadFieldsApi();
    setTypeByID(data);
    dispatch({
      type: "FORM_FIELDS_FETCH_SUCCESS",
      payload: { id: "leads", data }
    });
  } catch (err) {
    dispatch({ type: "FORM_FIELDS_FETCH_ERROR", payload: err, error: true });
  }
};
export const getField = props => async dispatch => {
  const { id } = props;
  try {
    dispatch({
      type: "OBJECTS_GET_FIELD_START",
      payload: { id }
    });
    const data = await fetchLeadFieldApi({
      id
    });
    dispatch({
      type: "OBJECTS_GET_FIELD_SUCCESS",
      payload: { id, ...data }
    });
  } catch (err) {
    dispatch({ type: "OBJECTS_GET_FIELD_ERROR", payload: err, error: true });
  }
};
