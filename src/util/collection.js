import { find } from "lodash";

export const noStrictIncludes = (collection, value) => {
  // eslint-disable-next-line
  return find(collection, val => val == value) != null;
};
