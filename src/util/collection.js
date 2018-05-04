import { find } from "lodash";

export const noStrictIncludes = (collection, value) => {
  // eslint-disable-next-line
  return find(collection, val => val == value) != null;
};
export const noStrictExcludes = (collection, value) => {
  // eslint-disable-next-line
  if (Array.isArray(value)) {
    if (!value.length) return false;
    for (let i = 0; i < value.length; i++) {
      const isDenied = collection.every(val => val != value[i]); // return True if all items deprecated
      return !isDenied; // if isDenied === true (deprecated) => false (not show) else => show
    }
  }
  return find(collection, val => val != value) != null;
};
