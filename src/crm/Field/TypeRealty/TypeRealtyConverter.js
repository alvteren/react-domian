import { map, forOwn, reduce } from "lodash";
import getVisibleValues from "../getVisibleValues";

export const SECTION = "section";
export const TYPE_REALTY = "uf_crm_type_realty";
const TYPE = "uf_crm_type_realty";
const keysToMatch = [SECTION, TYPE_REALTY];

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
    typeRealty: lead[TYPE_REALTY] || []
  };

  const {
    [SECTION]: section,
    [TYPE_REALTY]: typeRealty
  } = fields;

  const visibleDistricts = getVisibleValues(section, lead);
  return map(visibleDistricts.items, sectionItem => {
    const checked = prefers.section.indexOf(parseInt(sectionItem.value, 10)) !== -1;
    const children = reduce(
      typeRealty.items,
      (result, realtyItem) => {
        if (realtyItem.link.indexOf(sectionItem.value) === -1) {
          return result;
        }
        const checked =
          prefers.typeRealty.indexOf(parseInt(realtyItem.value, 10)) !== -1;
        return [...result, { ...realtyItem, checked }];
      },
      []
    );
    const checkedChildren = children.filter(realtyItem => realtyItem.checked);

    return {
      ...sectionItem,
      checked,
      children,
      checkedLength: checkedChildren.length
    };
  });
}
