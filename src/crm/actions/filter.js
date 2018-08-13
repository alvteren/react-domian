import { clearData } from "./table";
import { fetchList } from "./crm";
import { fetchChips as fetchChipsApi } from "../../api/chips";
import getFormatValue from "../Field/getFormatValue";

export const CHIPS_DELETED_SUCCESS = "CHIPS_DELETED_SUCCESS";
export const CHIPS_FETCH_STARTED = "CHIPS_FETCH_STARTED";
export const CHIPS_FETCH_SUCCESS = "CHIPS_FETCH_SUCCESS";
export const CHIPS_FETCH_ERROR = "CHIPS_FETCH_ERROR";
export const CHIPS_ADDED_SUCCESS = "CHIPS_ADDED_SUCCESS";
export const FILTER_TOGGLE = "FILTER_TOGGLE";
export const FILTER_SAVE_TO_STORE = "FILTER_SAVE_TO_STORE";

export const selectChip = props => dispatch => {
  const { entityId, chip } = props;
  dispatch({ type: CHIPS_ADDED_SUCCESS, payload: { entityId, chip } });
  dispatch(applyFilter({ entityId }));
};

export const deleteChip = props => dispatch => {
  const { entityId, chipId } = props;

  dispatch({ type: CHIPS_DELETED_SUCCESS, payload: { entityId, chipId } });
  dispatch(applyFilter({ entityId }));
};

export const fetchChips = props => async dispatch => {
  const { entityId, query } = props;
  try {
    dispatch({ type: CHIPS_FETCH_STARTED, payload: { entityId } });

    const data = await fetchChipsApi({
      entityId,
      query
    });
    dispatch({
      type: CHIPS_FETCH_SUCCESS,
      payload: { entityId, data: data }
    });
  } catch (err) {
    dispatch({ type: CHIPS_FETCH_ERROR, payload: err, error: true });
  }
};

export const applyFilter = props => async (dispatch, getState) => {
  const { entityId } = props;

  const { filter, rowsPerPage, order, orderBy, page } = getState().crm[
    entityId
  ];

  dispatch(clearData({ entityId }));
  if (page === 0) {
    dispatch(
      fetchList({
        entityId,
        filter: filter.values,
        page,
        rowsPerPage,
        orderBy,
        order
      })
    );
  }
};

export const filterToggle = props => dispatch => {
  const { entityId, open } = props;
  dispatch({ type: FILTER_TOGGLE, payload: { entityId, open } });
};

export const saveToStore = props => async (dispatch, getState) => {
  const { entityId, name, value } = props;
  const { values } = getState().crm[entityId].filter;
  const oldValue = values[name];
  if (oldValue) {
    const chipId = getChipId({ name, value: oldValue });
    dispatch(deleteChip({ entityId, chipId }));
  }

  if (value != null) {
    const id = getChipId({ name, value });
    const { fields } = getState().crm[entityId].filter;
    let field = {};
    let label = "";
    if (name.indexOf("_from") > 0) {
      field = fields[name.replace("_from", "")];
      label = field.label + " от";
    } else if (name.indexOf("_to") > 0) {
      field = fields[name.replace("_to", "")];
      label = field.label + " до";
    } else {
      field = fields[name];
      label = field.label;
    }

    dispatch(
      selectChip({
        entityId,
        chip: {
          id,
          type: name,
          value,
          label: `${label}: ${getFormatValue(field, value)}`
        }
      })
    );
  }

  dispatch({
    type: FILTER_SAVE_TO_STORE,
    payload: { entityId, name, value }
  });
};

const getChipId = props => {
  const { name, value } = props;

  if (Array.isArray(value)) {
    return `${name}_${value.join("_")}`;
  }
  return `${name}_${value}`;
};
