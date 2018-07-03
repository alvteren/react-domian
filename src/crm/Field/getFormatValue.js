import { get } from "lodash";

const getFormatValue = (field, value) => {
  if (field.items) {
    const listValue = field.hasOwnProperty("items")
      ? get(field.items, value, null) ||
        get(field.items, String(value).toLowerCase(), null)
      : null;
    return listValue ? listValue.label : "";
  }
  if (field.type === "switch") {
    return value === true || value === "Y" ? "Да" : "Нет";
  }
  if (field.type === "location") {
    return value.name;
  }
  return value;
};
export default getFormatValue;
