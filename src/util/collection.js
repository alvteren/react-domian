import { find } from "lodash";

export const noStrictIncludes = (collection, value) => {
  // eslint-disable-next-line
  return find(collection, val => val == value) != null;
};
export const noStrictExcludes = (collection, value) => {
  // eslint-disable-next-line
  return find(collection, val => val != value) != null;
};
