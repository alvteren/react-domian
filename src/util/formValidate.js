import { ENTITIES } from "../constants";
import { get } from "lodash";
import getVisibleValues from "../crm/Field/getVisibleValues";

import { rules as leadRules } from "../crm/Lead/validate";
import { rules as saleRules } from "../crm/SaleList/validate";
import { rules as reminderRules } from "../crm/Reminder/validate";
// import { rules as showRules } from "../crm/Reminder/validate";
import { formFields as leadFormFields } from "../crm/reducers/lead";
import { formFields as saleFormFields } from "../crm/reducers/sale";
import { formFields as reminderFields } from "../crm/reducers/reminder";
import { formFields as showFields } from "../crm/reducers/show";

const showRules = {
  rules: {},
  excludeValidationProps: []
};

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
  },
  date(val) {
    const today = new Date();
    const date = new Date(val);
    if (isNaN(date)) return { message: "Неверный формат даты" };
    if (date < today) return { message: "Дата не может быть меньше текущей" };
    return true;
  }
};

const forms = {
  [ENTITIES.lead]: leadFormFields,
  [ENTITIES.sale]: saleFormFields,
  [ENTITIES.reminder]: reminderFields,
  [ENTITIES.show]: showFields
};

const excludeValidationProps = {
  [ENTITIES.lead]: leadRules.excludeValidationProps,
  [ENTITIES.sale]: saleRules.excludeValidationProps,
  [ENTITIES.reminder]: reminderRules.excludeValidationProps,
  [ENTITIES.show]: showRules.excludeValidationProps
};

const idRules = {
  [ENTITIES.lead]: leadRules.rules,
  [ENTITIES.sale]: saleRules.rules,
  [ENTITIES.reminder]: reminderRules.rules,
  [ENTITIES.show]: showRules.rules,
};

/**
 *
 * @param form {Object}
 * @param fields {Object}
 * @param entityId "String"
 * @param propId "String"
 * @return {Object}|null with error fields keys or null if form has no validate errors
 */

export default function formValidate({ form, fields, entityId, propId }) {
  const validateErrors = {};
  const customRules = idRules[entityId];
  const excludeProps  = excludeValidationProps[entityId];
  let checked = false;

  if (propId) {
    /*
      Branch for check only one prop (on edit)
     */

    const visibleValues = getVisibleValues(fields[propId], form);
    if (!visibleValues) return;
    if (visibleValues instanceof Object && !get(visibleValues, "show", true)) return;
    const isFilled = isEmpty(form[propId]);

    /* Check for required props */
    if (fields[propId].required) {
      if (!isFilled) {
        validateErrors[propId] = {
          message: "Это поле обязательно для заполнения"
        };
        checked = true;
      }
    }

    /* Check for rules follow by type */
    if (isFilled && typeRules.hasOwnProperty(fields[propId].type) && !checked) {
      const isValid = typeRules[fields[propId].type](form[propId]);
      if (isValid !== true) {
        validateErrors[propId] = isValid;
        checked = true;
      }
    }

    /* Check for rules follow by id */
    if (isFilled && customRules[propId] && !checked) {
      const isValid = customRules[propId](form[propId], form);
      if (isValid !== true) {
        validateErrors[propId] = isValid;
        checked = true;
      }
    }
  } else {
    /*
      Branch for iterate over whole form (on new instance create)
     */

    Object.keys(forms[entityId]).forEach(propId => {

      if (Array.isArray(forms[entityId][propId])) {
        form[propId].forEach(item => {
          const path = propId;
          Object.keys(item).forEach(prop => {
            console.log(prop);
            checkProps(item, prop);
          });
        })
      } else {
        checkProps(form);
      }

      function checkProps(form, prop) {
        if (prop) propId = prop;
        const visibleValues = getVisibleValues(fields[propId], form);

        if (!visibleValues) return;
        if (visibleValues instanceof Object && !get(visibleValues, "show", true)) return;

        const isFilled = isEmpty(form[propId]);
        /* Service props exclude */
        if (excludeProps && excludeProps.includes(propId))
          return;

        /* Check for required props */
        if (fields[propId].required) {
          if (!isFilled) {
            validateErrors[propId] = {
              message: "Это поле обязательно для заполнения"
            };
            return;
          }
        }

        /* Check for rules follow by type */
        if (isFilled && typeRules.hasOwnProperty(fields[propId].type)) {
          const isValid = typeRules[fields[propId].type](form[propId]);
          if (isValid !== true) {
            validateErrors[propId] = isValid;
            return;
          }
        }

        /* Check for rules follow by id */
        if (isFilled && customRules[propId]) {
          const isValid = customRules[propId](form[propId], form);
          if (isValid !== true) {
            validateErrors[propId] = isValid;
            return;
          }
        }
      }
    });
  }
  return Object.keys(validateErrors).length ? validateErrors : null;
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
    case "number":
      return prop.toString().length;
    default:
      return false;
  }
}
