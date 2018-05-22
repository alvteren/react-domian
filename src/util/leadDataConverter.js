import { dateToString } from "./dateConverter";

export default function convertLeadData(data) {
  Object.keys(data).forEach(key => {
    let obj = data[key];
    obj.created = formatDate(obj.date_create);
    obj.responsible = `${obj.assigned_by_name} ${obj.assigned_by_last_name}`;
  })
};

export function   formatDate(dateString) {
  let date = "";
  // replace month and day for valid date format
  let dateArr = dateString.split(" ");
  dateArr[0] = dateArr[0].split(".");
  const replaceTemp = dateArr[0][0];
  dateArr[0][0] = dateArr[0][1];
  dateArr[0][1] = replaceTemp;
  dateArr[0] = dateArr[0].join(".");
  let dateStr = dateArr.join(" ");
  date = new Date(dateStr);
  // if no success after replace operation return empty String
  if (isNaN(date)) return '';
  return dateToString(dateStr);
}
