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
 * @param location - String
 * @param fields - {Object}
 * @return resultTree - [Object]
 */
export function districtTreeConverter(location, fields) {
  console.log(arguments);
  debugger;
  if (!location || !fields) return false;

  let resultTree = [];
  // Add districts to tree
  _.forOwn(fields[DISTRICTS].items, (districtValue, districtKey) => {
    if (districtValue.link && Array.isArray(districtValue.link) && districtValue.link.includes(String(location))) {
      // Add sub districts to current district as children
      _.forOwn(fields[SUB_DISTRICTS].items, (subDistrictValue, subDistrictKey) => {
        if (subDistrictValue.link && Array.isArray(subDistrictValue.link) && subDistrictValue.link.includes(districtKey)) {
          districtValue.children ? districtValue.children.push(subDistrictValue) : districtValue.children = [subDistrictValue];
        }
      });
      resultTree.push(districtValue);
    }
  });
  console.log("TREE", resultTree);
  return resultTree
}
