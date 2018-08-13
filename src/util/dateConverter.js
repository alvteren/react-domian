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

/**
 * Getting tomorrow date for set as default
 * @return {string} ISO date "2018-05-22T20:20" part
 */
export const getTomorrowDate = function(format) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const ISOdate = date.toISOString();
  // remove secs and timezone (:ss & .000Z) as Mui requires
  return convertDateForMui(ISOdate, format);
};

/**
 * Convert server ISO date str for Mui
 * @param dateStr - ISO date str in "2018-05-22T20:20:08+03:00" format
 * @format String date|datetime-local
 * @return {string} only "2018-05-22T20:20" | "2018-05-22" part
 */
export const convertDateForMui = function(dateStr, format) {
  if (!dateStr) return null;
  switch (format) {
    case "date": dateStr = dateStr.substr(0, 10);
      break;
    case "datetime-local": dateStr = dateStr.substr(0, 16);
      break;
  }
  return dateStr;
};
