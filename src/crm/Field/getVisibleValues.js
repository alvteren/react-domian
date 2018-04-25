import { get, reduce, size, isObject, forEach } from "lodash";
import { noStrictIncludes, noStrictExcludes } from "../../util/collection";

const getVisibleValues = (field, values) => {
  const isDepended = get(field, "depended", null) !== null;

  if (isDepended) {
    if (values == null) return null;
    let linkedValue = get(values, field.depended, null);
    if (isObject(linkedValue) && linkedValue["value"]) {
      linkedValue = linkedValue.value;
    } else if (isObject(linkedValue) && linkedValue["id"]) {
      linkedValue = linkedValue.id;
    }
    if (field["link"]) {
      return noStrictIncludes(field.link, linkedValue) ? true : null;
    }
    if (field["exclude_link"]) {
      return noStrictExcludes(field.exclude_link, linkedValue) ? true : null;
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
      return size(items) > 0 ? items : null;
    }
  }

  return get(field, "items", true);
};
export default getVisibleValues;
