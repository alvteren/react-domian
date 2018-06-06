import React from "react";
import { TextField} from "material-ui"
import { get } from "lodash";

const Date = props => {
  return (
    <TextField
      id={props.field.id}
      label={props.label}
      type={props.dateType || "datetime-local"}
      defaultValue={props.value}
      onChange={props.onChange}
      disabled={get(props, "visibleValues.disabled")}
      InputLabelProps={{
        shrink: true,
      }}
      error={Boolean(props.validateError)}
      helperText={
        get(props.validateError,
          "message",
          get(props.field, "hint", "")
        )}
    />
  )
};

export default Date;