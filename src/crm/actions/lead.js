import { fetchLeads as fetchLeadsApi } from "../../api/lead";
import { fetchLead as fetchLeadApi } from "../../api/lead";
import { fetchLeadFields as fetchLeadFieldsApi } from "../../api/lead";
import { fetchLeadField as fetchLeadFieldApi } from "../../api/lead";
import { ENTITIES } from "../../constants";

// Action types

export const fetchLeads = props => async dispatch => {
  const { filter, page, rowsPerPage, orderBy, order } = props;
  try {
    dispatch({
      type: "TABLE_FETCH_DATA_START",
      payload: { entityId: ENTITIES.lead }
    });
    const data = await fetchLeadsApi({
      filter,
      limit: [page * rowsPerPage, rowsPerPage],
      orderBy,
      order
    });
    dispatch({
      type: "TABLE_FETCH_DATA_SUCCESS",
      payload: { entityId: ENTITIES.lead, ...data }
    });
  } catch (err) {
    dispatch({ type: "TABLE_FETCH_DATA_ERROR", payload: err, error: true });
  }
};

export const fetchLead = id => async dispatch => {
  try {
    dispatch({
      type: "DETAIL_FETCH_DATA_START",
      payload: { entityId: ENTITIES.lead }
    });
    const data = await fetchLeadApi({ id });
    dispatch({
      type: "DETAIL_FETCH_DATA_SUCCESS",
      payload: { ientityId: ENTITIES.lead, ...data }
    });
  } catch (err) {
    dispatch({ type: "DETAIL_FETCH_DATA_ERROR", payload: err, error: true });
  }
};
export const onInitLead = props => async dispatch => {
  const { id } = props;
  dispatch({
    type: "DETAIL_INIT",
    payload: { entityId: ENTITIES.lead, current: id }
  });
};

export const fetchLeadFields = () => async dispatch => {
  try {
    dispatch({
      type: "FORM_FIELDS_FETCH_START",
      payload: { id: "lead" }
    });
    const data = await fetchLeadFieldsApi();
    dispatch({
      type: "FORM_FIELDS_FETCH_SUCCESS",
      payload: { id: "lead", data }
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
