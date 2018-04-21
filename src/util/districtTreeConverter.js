import _ from "lodash";

const DISTRICTS = "uf_crm_district";
const SUB_DISTRICTS = "uf_crm_subdistrict";
const TYPE = "district";
const keysToMatch = [DISTRICTS, SUB_DISTRICTS];

/**
 *
 * @param values - {Object}
 * @return undefined
 */
export function setTypeByID(values) {
  _.forOwn(values, (item, key) => {
    if (keysToMatch.includes(key)) item.type = TYPE;
  })
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
    district: lead.uf_crm_district,
    subDistrict: lead.uf_crm_subdistrict
  };

  let resultTree = [];
  // Add districts to tree
  _.forOwn(fields[DISTRICTS].items, (districtValue, districtKey) => {
    if (districtValue.link && Array.isArray(districtValue.link) && districtValue.link.includes(String(location))) {
      districtValue.checkedLength = 0;
      if (prefers.district && prefers.district.includes(parseInt(districtKey))) districtValue.checked = true;
      // Add sub districts to current district as children
      _.forOwn(fields[SUB_DISTRICTS].items, (subDistrictValue, subDistrictKey) => {
        if (subDistrictValue.link && Array.isArray(subDistrictValue.link) && subDistrictValue.link.includes(districtKey)) {
          if (prefers.subDistrict && prefers.subDistrict.includes(parseInt(subDistrictKey))) {
            // set length of selected items
            districtValue.checkedLength ? districtValue.checkedLength++ : districtValue.checkedLength = 1;
            if (districtValue.checkedLength === districtValue.children.length) districtValue.checked = true;
            subDistrictValue.checked = true;
          }
          districtValue.children ? districtValue.children.push(subDistrictValue) : districtValue.children = [subDistrictValue];
        }
      });
      resultTree.push(districtValue);
    }
  });
  return resultTree
}
