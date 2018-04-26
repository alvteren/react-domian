import { map, forOwn, reduce } from "lodash";
import getVisibleValues from "../getVisibleValues";

export const DISTRICTS = "uf_crm_district";
export const SUB_DISTRICTS = "uf_crm_subdistrict";
const TYPE = "district";
const keysToMatch = [DISTRICTS, SUB_DISTRICTS];

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
export function districtTreeConverter(lead, fields) {
  if (!lead || !fields) return [];

  const location = lead.uf_location.value;
  const prefers = {
    district: lead[DISTRICTS] || [],
    subDistrict: lead[SUB_DISTRICTS] || []
  };

  const {
    [DISTRICTS]: districtField,
    [SUB_DISTRICTS]: subDistrictField
  } = fields;

  const visibleDistricts = getVisibleValues(districtField, lead);
  return map(visibleDistricts, district => {
    const checked = prefers.district.indexOf(parseInt(district.value)) !== -1;
    const children = reduce(
      subDistrictField.items,
      (result, subDistrict) => {
        if (subDistrict.link.indexOf(district.value) === -1) {
          return result;
        }
        const checked =
          prefers.subDistrict.indexOf(parseInt(subDistrict.value)) !== -1;
        return [...result, { ...subDistrict, checked }];
      },
      []
    );
    const checkedChildren = children.filter(subDistrict => subDistrict.checked);

    return {
      ...district,
      checked,
      children,
      checkedLength: checkedChildren.length
    };
  });
}
