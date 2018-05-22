/**
 *
 * @param dateStr - valid date string
 * @return {string} in format dd.mm.yyyy
 */

export const dateToString = function(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) {
    console.warn("invalid date format");
    return "";
  }
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // Month count from '0'

  const yyyy = date.getFullYear();
  if(dd < 10){
    dd= "0" + dd;
  }
  if(mm < 10){
    mm= "0" + mm;
  }
  return `${dd}.${mm}.${yyyy}`;
};