import { ENTITIES } from "../constants";

import { rules as leadRules } from "../crm/Lead/validate";
import { rules as saleRules } from "../crm/SaleList/validate";
import { formFields as leadFormFields } from "../crm/reducers/lead";
import { formFields as saleFormFields } from "../crm/reducers/sale";

export const typeRules = {
  email(val) {
    // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const re = /.+@.+\..+/i;
    const isValid = re.test(val);
    if (isValid) return true;
    return { message: "Введите корректный e-mail" };
  },
  tel(val) {
    const re = /^(\+7)(\(\d{3}\))\d{3}-\d{2}-\d{2}$/;
    const isValid = re.test(val);
    if (isValid) return true;
    return { message: "Введите телефон в формате +7(999)999-99-99" };
  },
  number(val) {
    const re = /,/gi;
    const testedValue = val.replace(re, ".");
    const isValid = !isNaN(Number(testedValue));
    if (isValid) return true;
    return { message: "Значение должно быть числом" };
  }
};

const forms = {
  [ENTITIES.lead]: leadFormFields,
  [ENTITIES.lead]: saleFormFields
};

const idRules = {
  [ENTITIES.lead]: leadRules,
  [ENTITIES.sale]: saleRules
};

/**
 *
 * @param form {Object}
 * @param fields {Object}
 * @param entityId "String"
 * @param propId "String"
 * @return {Object} with error fields keys
 */

export default function formValidate({ form, fields, entityId, propId }) {
  const validateErrors = {};
  const { exludeValidationProps } = idRules[entityId];

  if (propId) {
    const isFilled = isEmpty(form[propId]);
    /*
      Branch for check only one prop (on edit)
     */

    /* Check for required props */
    if (fields[propId].required) {
      const isPropValid = Boolean(form[propId] || form[propId].length);
      if (isPropValid) return true;
      validateErrors[propId] = {
        message: "Это поле обязательно для заполнения"
      };
      return validateErrors;
    }

    /* Check for rules follow by type */
    if (isFilled && typeRules.hasOwnProperty(fields[propId].type)) {
      const isValid = typeRules[fields[propId].type](form[propId]);
      if (isValid === true) return true;
      validateErrors[propId] = isValid;
      return validateErrors;
    }

    /* Check for rules follow by id */
    if (isFilled && typeRules[propId]) {
      const isValid = typeRules[propId](form[propId]);
      if (isValid === true) return true;
      validateErrors[propId] = isValid;
      return validateErrors;
    }
  } else {
    /*
      Branch for iterate over whole form (on new instance create)
     */
    Object.keys(forms[entityId]).forEach(propId => {
      const isFilled = isEmpty(form[propId]);
      /* Service props exclude */
      if (exludeValidationProps && exludeValidationProps.includes(propId))
        return;

      /* Check for required props */
      if (fields[propId].required) {
        const isPropValid = Boolean(form[propId] || form[propId].length);
        if (!isPropValid) {
          validateErrors[propId] = {
            message: "Это поле обязательно для заполнения"
          };
          return;
        }
      }

      /* Check for rules follow by type */
      if (isFilled && typeRules.hasOwnProperty(fields[propId].type)) {
        const isValid = typeRules[fields[propId].type](form[propId]);
        if (isValid === true) return;
        validateErrors[propId] = isValid;
      }

      /* Check for rules follow by id */
      if (isFilled && typeRules[propId]) {
        const isValid = typeRules[propId](form[propId]);
        if (isValid === true) return;
        validateErrors[propId] = isValid;
      }
    });
    return validateErrors;
  }
  // if tested prop neither filled or required
  return true;
}

function isEmpty(prop) {
  switch (typeof prop) {
    case "boolean":
      return true;
    case "string":
      return Boolean(prop.length);
    case "object":
      if (Array.isArray(prop)) return Boolean(prop.length);
      return true;
    default:
      return false;
  }
}
