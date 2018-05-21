/**
 *
 * @param dateStr - date string ISO
 * @return {string} in format dd.mm.yyyy
 */

export const dateISOToString = function(dateStr) {
  const date = new Date(dateStr);
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