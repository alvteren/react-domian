import { rules as leadRules } from "../crm/Lead/validate";

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

const idRules = {
  lead: leadRules,
  // object: objectIdRules
};

/**
 *
 * @param form {Object}
 * @param fields {Object}
 * @param entityId "String"
 * @return {Object} with error fields keys
 */

export default function formValidate({ form, fields, entityId }) {
  const validateErrors = {};
  const serviceProps = idRules[entityId].serviceProps;

  Object.keys(form).forEach( prop => {
    /*
      Service props exclude
     */
    if (serviceProps && serviceProps.includes(prop)) return true;

    /*
      Check for required props
     */
    if (fields[prop].required) {
      const isPropValid = Boolean(form[prop] || form[prop].length);
      if (!isPropValid) {
        validateErrors[prop] = { message: "Это поле обязательно для заполнения" };
        return false;
      }
    }

    /*
      Check for rules follow by type
     */
    if (form[prop].length && typeRules.hasOwnProperty(fields[prop].type)) {
      const isValid = typeRules[fields[prop].type](form[prop]);
      if ( isValid === true) return true;
      validateErrors[prop] = isValid;
    }

    /*
      Check for rules follow by id
     */
    if (form[prop].length && typeRules[prop]) {
      const isValid = typeRules[prop](form[prop]);
      if ( isValid === true) return true;
      validateErrors[prop] = isValid;
    }
    return true;
  });

  return  validateErrors;
}
