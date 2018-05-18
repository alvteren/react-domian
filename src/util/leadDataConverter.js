export default function convertLeadData(data) {
  debugger;
  Object.keys(data).forEach(key => {
    let obj = data[key];
    obj.created = formatDate(obj.date_create);
    obj.responsible = `${obj.assigned_by_name} ${obj.assigned_by_last_name}`;
    obj.reminders = null;
    debugger;
  })
};

function formatDate(dateString) {
  let date = new Date(dateString);
  if (isNaN(date)) {
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
}
