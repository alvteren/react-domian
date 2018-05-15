import { entities } from "../constants";

import { rules as leadRules } from "../crm/Lead/validate";
import { formFields as leadFormFields } from "../crm/reducers/leads";

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
    return { message: "Введите телефон в формате +7(999)999-99-99" }
  },
  number(val) {
    const re = /,/gi;
    const testedValue= val.replace(re, ".");
    const isValid = !isNaN(Number(testedValue));
    if (isValid) return true;
    return { message: "Значение должно быть числом" }
  }
};

const forms = {
  [entities.lead]: leadFormFields
};

const idRules = {
  lead: leadRules,
  // object: objectIdRules
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
  const serviceProps = idRules[entityId].serviceProps;

  if (propId) {
    const prop = propId;
    const isFilled = isEmpty(form[prop]);
    /*
      Branch for check only one prop (on edit)
     */

    /* Check for required props */
    if (fields[prop].required) {
      const isPropValid = Boolean(form[prop] || form[prop].length);
      if (isPropValid) return true;
      console.log("req");
      validateErrors[prop] = { message: "Это поле обязательно для заполнения" };
      return validateErrors;
    }

    /* Check for rules follow by type */
    if (isFilled && typeRules.hasOwnProperty(fields[prop].type)) {
      const isValid = typeRules[fields[prop].type](form[prop]);
      if ( isValid === true) return true;
      console.log("type");
      validateErrors[prop] = isValid;
      return validateErrors;
    }

    /* Check for rules follow by id */
    if (isFilled && typeRules[prop]) {
      const isValid = typeRules[prop](form[prop]);
      if ( isValid === true) return true;
      validateErrors[prop] = isValid;
      return validateErrors;
    }
  } else {
    /*
      Branch for iterate over whole form (on new instance create)
     */
    Object.keys(forms[entityId]).forEach( prop => {
      const isFilled = isEmpty(form[prop]);
      /* Service props exclude */
      if (serviceProps && serviceProps.includes(prop)) return;

      /* Check for required props */
      if (fields[prop].required) {
        const isPropValid = Boolean(form[prop] || form[prop].length);
        if (!isPropValid) {
          validateErrors[prop] = { message: "Это поле обязательно для заполнения" };
          return;
        }
      }

      /* Check for rules follow by type */
      if (isFilled && typeRules.hasOwnProperty(fields[prop].type)) {
        const isValid = typeRules[fields[prop].type](form[prop]);
        if ( isValid === true) return;
        validateErrors[prop] = isValid;
      }

      /* Check for rules follow by id */
      if (isFilled && typeRules[prop]) {
        const isValid = typeRules[prop](form[prop]);
        if ( isValid === true) return;
        validateErrors[prop] = isValid;
      }
    });
    return  validateErrors;
  }
  // if tested prop neither filled or required
  return true;
}

function isEmpty(prop) {
  switch (typeof prop) {
    case "boolean": return true;
    case "string": return Boolean(prop.length);
    case "object": if (Array.isArray(prop)) return Boolean(prop.length);
      return true;
    default: return false;
  }
}