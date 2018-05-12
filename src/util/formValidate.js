const serviceProps = ["can", "validateErrorArr"];

const rules = {
  email(val) {
    // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const re = /.+@.+\..+/i;
    const isValid = re.test(val);
    if (isValid) return true;
    return { message: "Введите корректный e-mail" };
  },
  phone(val) {
    const re = /^(\+7)(\(\d{3}\))\d{3}-\d{2}-\d{2}$/;
    const isValid = re.test(val);
    if (isValid) return true;
    return { message: "Введите телефон в формате +7(999)999-99-99" }
  },
  opportunity(val) {
    const re = /,/gi;
    const testedValue= val.replace(re, ".");
    const isValid = !isNaN(Number(testedValue));
    if (isValid) return true;
    return { message: "Сумма должна быть числом" }
  }
};

/**
 *
 * @param form {Object}
 * @param fields {Object}
 * @return {Object} with error fields keys
 */

export default function formValidate({ form, fields }) {
  const validateErrors = {};
  Object.keys(form).forEach( prop => {
    /*
      Service props exclude
     */
    if (serviceProps.includes(prop)) return true;

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
      Check for rules follow
     */
    if (form[prop].length && rules[prop]) {
      const isValid = rules[prop](form[prop]);
      if ( isValid === true) return true;
      validateErrors[prop] = isValid;
    }
    return true;
  });

  return  validateErrors;
}
