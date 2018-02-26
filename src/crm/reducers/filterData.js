import { omit, keyBy, toArray } from "lodash";
export default (state, { type, payload }) => {
  let newstate = null;
  if (state) {
    if (type === "CHIPS_DELETED_SUCCESS") {
      const { chipId } = payload;
      const newSelectedChips = omit(state.selectedChips, chipId);
      newstate = {
        ...state,
        selectedChips: newSelectedChips
      };
      const array = toArray(newSelectedChips);
      const object = array.reduce((result, currentValue) => {
        return { ...result, [currentValue.type]: currentValue.value };
      }, {});

      newstate.filter.chips = object;
    }
    if (type === "CHIPS_ADDED_SUCCESS") {
      const { chip } = payload;
      const newSelectedChips = { ...state.selectedChips, [chip.id]: chip };
      newstate = {
        ...state,
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

      newstate.filter.chips = object;
    }

    if (type === "CHIPS_FETCH_STARTED") {
      newstate = {
        ...state,
        loading: { ...state.loading, chips: true }
      };
    }
    if (type === "CHIPS_FETCH_SUCCESS") {
      const { data } = payload;
      newstate = {
        ...state,
        chips: keyBy(data, "id"),
        loading: { ...state.loading, chips: false }
      };
    }
  }
  if (newstate) {
    return { ...state, ...newstate };
  }

  return null;
};
