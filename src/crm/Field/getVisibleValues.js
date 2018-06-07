import { get, reduce, size, isObject } from "lodash";
import { noStrictIncludes, noStrictExcludes } from "../../util/collection";

/**
 *
 * @param field - field from fields schema
 * @param values - form values
 * @return {Object} - { show*: Boolean, items: Array, disable: Boolean }
 */
const getVisibleValues = (field, values) => {
  const isDepended = get(field, "depended", null) !== null;
  if (isDepended) {
    if (values == null) return { show: false };
    let linkedValue = get(values, field.depended, null);
    if (isObject(linkedValue) && linkedValue["value"]) {
      linkedValue = linkedValue.value;
    } else if (isObject(linkedValue) && linkedValue["id"]) {
      linkedValue = linkedValue.id;
    }
    if (field["link"]) {
      return noStrictIncludes(field.link, linkedValue)
        ? field.items
          ? { show: true, items: field.items }
          : { show: true }
        : { show: false };
    }
    if (field["exclude_link"]) {
      return noStrictExcludes(field.exclude_link, linkedValue)
        ? field.items
          ? { show: true, items: field.items }
          : { show: true }
        : { show: false };
    }
    if (get(field, "items", false)) {
      const items = reduce(
        field.items,
        (result, item, id) => {
          let bAdd = false;
          const itemLinkedValue = item["depended"]
            ? item.depended
            : linkedValue;
          if (item["link"]) {
            bAdd = noStrictIncludes(item.link, itemLinkedValue);
          }
          if (item["exclude_link"]) {
            bAdd = noStrictExcludes(item.exclude_link, itemLinkedValue);
          }
          return bAdd ? { ...result, [id]: item } : result;
        },
        {}
      );
      return size(items) > 0 ? { show: true, items } : { show: false };
    }
    if (field.dependedValue) {
      const hidden = field.dependedValue !== linkedValue;
      return { show: !hidden, [field.dependedAction]: hidden };
    }
  }

  return { show: true, items: get(field, "items", null) };
};
export default getVisibleValues;
