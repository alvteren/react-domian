import React from "react";
import { TextField} from "material-ui"
import { get } from "lodash";

const Date = props => {
  return (
    <TextField
      id={props.id}
      label={props.label}
      type={props.dateType || "datetime-local"}
      defaultValue={props.value}
      onChange={props.onChange}
      disabled={get(props, "visibleValues.disabled")}
      InputLabelProps={{
        shrink: true,
      }}
    />
  )
};

export default Date;