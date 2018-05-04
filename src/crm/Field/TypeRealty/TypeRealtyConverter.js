import { map, forOwn, reduce } from "lodash";
import getVisibleValues from "../getVisibleValues";

export const SECTION = "section";
export const TYPE_OBJECT = "uf_crm_type_object_2";
const TYPE = "uf_crm_type_realty";
const keysToMatch = [SECTION, TYPE_OBJECT];

/**
 *
 * @param values - {Object}
 * @return undefined
 */
export function setTypeByID(values) {
  forOwn(values, (item, key) => {
    if (keysToMatch.includes(key)) item.type = TYPE;
  });
}

/**
 *
 * @param lead - {Object}
 * @param fields - {Object}
 * @return resultTree - [Object]
 */
export function typeRealtyConverter(lead, fields) {
  if (!lead || !fields) return [];

  const prefers = {
    section: lead[SECTION] || [],
    typeObject: lead[TYPE_OBJECT] || []
  };

  const {
    [SECTION]: section,
    [TYPE_OBJECT]: typeObject
  } = fields;

  const visibleDistricts = getVisibleValues(section, lead);
  return map(visibleDistricts, district => {
    const checked = prefers.district.indexOf(parseInt(district.value, 10)) !== -1;
    const children = reduce(
      typeObject.items,
      (result, subDistrict) => {
        if (subDistrict.link.indexOf(district.value) === -1) {
          return result;
        }
        const checked =
          prefers.subDistrict.indexOf(parseInt(subDistrict.value, 10)) !== -1;
        return [...result, { ...subDistrict, checked }];
      },
      []
    );
    const checkedChildren = children.filter(subDistrict => subDistrict.checked);

    return {
      ...district,
      children
    };
  });
}
