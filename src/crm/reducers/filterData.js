import { omit, keyBy, toArray, reduce } from "lodash";
import * as actionsType from "../actions/filter";
import { ACTIVE_TOOL } from "../actions/rightTools";
import { RIGHT_TOOLS } from "../../constants";
import { FORM_FIELDS_FETCH_SUCCESS } from "../actions/crm";
import Street from "../Filter/Field/Street";

export default (state, { type, payload }) => {
  let newstate = null;
  if (state) {
    if (type === actionsType.CHIPS_DELETED_SUCCESS) {
      const { chipId } = payload;
      const newSelectedChips = omit(state.selectedChips, chipId);
      newstate = {
        selectedChips: newSelectedChips
      };
      const array = toArray(newSelectedChips);
      const object = array.reduce((result, currentValue) => {
        return { ...result, [currentValue.type]: currentValue.value };
      }, {});

      newstate.filter = {
        ...state.filter,
        values: { ...state.filter.values, chips: object }
      };
    }
    if (type === actionsType.CHIPS_ADDED_SUCCESS) {
      const { chip } = payload;
      const newSelectedChips = { ...state.selectedChips, [chip.id]: chip };
      newstate = {
        selectedChips: newSelectedChips
      };
      const array = toArray(newSelectedChips);
      const object = array.reduce((result, currentValue) => {
        const newValues =
          result[currentValue.type] == null
            ? [currentValue.value]
            : [...result[currentValue.type], currentValue.value];
        return {
          ...result,
          [currentValue.type]: newValues
        };
      }, {});

      newstate.filter = {
        ...state.filter,
        values: { ...state.filter.values, chips: object }
      };
    }

    if (type === actionsType.CHIPS_FETCH_STARTED) {
      newstate = {
        loading: { ...state.loading, chips: true }
      };
    }
    if (type === actionsType.CHIPS_FETCH_SUCCESS) {
      const { data } = payload;
      newstate = {
        chips: keyBy(data, "id"),
        loading: { ...state.loading, chips: false }
      };
    }
    if (type === actionsType.FILTER_TOGGLE) {
      const { open } = payload;
      newstate = {
        filter: { ...state.filter, open }
      };
    }
    if (type === ACTIVE_TOOL) {
      const { toolId } = payload;
      if (toolId === RIGHT_TOOLS.filter) {
        newstate = {
          filter: { ...state.filter, open: true }
        };
      }
    }
    if (type === FORM_FIELDS_FETCH_SUCCESS) {
      const { data: fields = {} } = payload;
      const { fields: fieldsFilter } = state.filter;
      const fieldsFilterKeys = Object.keys(fieldsFilter);

      const fieldsFilterResult = reduce(
        fieldsFilterKeys,
        (result, value) => {
          if (fields[value]) {
            return { ...result, [value]: fields[value] };
          }
          return result;
        },
        {}
      );

      fieldsFilterResult.street_string = {
        ...fieldsFilterResult.street_string,
        component: Street,
        type: "custom"
      };

      newstate = {
        filter: { ...state.filter, fields: fieldsFilterResult }
      };
    }

    if (type === actionsType.FILTER_SAVE_TO_STORE) {
      const { name, value } = payload;

      newstate = {
        filter: {
          ...state.filter,
          values: { ...state.filter.values, [name]: value }
        }
      };
    }
  }
  if (newstate) {
    return newstate;
  }

  return null;
};
