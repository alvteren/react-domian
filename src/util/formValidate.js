const serviceProps = ["can", "validateErrorArr"];

/**
 *
 * @param form {Object}
 * @param fields {Object}
 * @return {Array} of error fields
 */

export default function formValidate(form, fields) {
  const errorArr = [];
  Object.keys(form).forEach( prop => {
    if (serviceProps.includes(prop)) return true;
    if (fields[prop].required) {
      const isPropValid = Boolean(form[prop] || form[prop].length);
      if (isPropValid) return true;
      errorArr.push(prop);
      return false;
    }
    return true;
  });
  // const isValid = !Boolean(errorArr.length);
  return  errorArr;
}
