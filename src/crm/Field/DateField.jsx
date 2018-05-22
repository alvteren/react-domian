import React from "react";
import { TextField} from "material-ui"

const DateField = props => {
  debugger;

  function  getTomorrowDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const ISOdate = date.toISOString();
    // remove secs and timezone (:ss & .000Z) as Mui requires
    return ISOdate.substr(0, ISOdate.length - 8);
  }

  /**
   *
   * @param dateStr - ISO date str in "2018-05-22T20:20:08+03:00" format
   * @return {string} only "2018-05-22T20:20" part
   */
  function convertDateForMui (dateStr) {
    debugger;
    if (dateStr) return null;
    dateStr = dateStr.substr(0, dateStr.length - 9);
    return dateStr;
  }

  return (
    <TextField
      id={props.id}
      label={props.label}
      type={props.dateType || "datetime-local"}
      defaultValue={convertDateForMui(props.value) || getTomorrowDate()}
      onChange={props.onChange}
      disabled={props.disabled}
      InputLabelProps={{
        shrink: true,
      }}
    />
  )
};

export default DateField;