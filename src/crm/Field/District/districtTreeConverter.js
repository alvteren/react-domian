import { map, forOwn, reduce } from "lodash";
import getVisibleValues from "../getVisibleValues";

export const DISTRICTS = "uf_crm_district";
export const SUB_DISTRICTS = "uf_crm_subdistrict";

/**
 *
 * @param lead - {Object}
 * @param fields - {Object}
 * @return resultTree - [Object]
 */
export function districtTreeConverter(lead, fields) {
  if (!lead || !fields) return [];

  const prefers = {
    district: lead[DISTRICTS] || [],
    subDistrict: lead[SUB_DISTRICTS] || []
  };

  const {
    [DISTRICTS]: districtField,
    [SUB_DISTRICTS]: subDistrictField
  } = fields;

  const visibleDistricts = getVisibleValues(districtField, lead);
  return map(visibleDistricts.items, district => {
    const checked =
      prefers.district.indexOf(parseInt(district.value, 10)) !== -1;
    const children = reduce(
      subDistrictField.items,
      (result, subDistrict) => {
        if (subDistrict.link.indexOf(district.value) === -1) {
          return result;
        }
        const subDistrictChecked =
          prefers.subDistrict.indexOf(parseInt(subDistrict.value, 10)) !== -1 ||
          checked;
        return [...result, { ...subDistrict, checked: subDistrictChecked }];
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
