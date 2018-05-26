import React from "react";
import { TextField } from "material-ui";
import {get} from "lodash";

const Text = (props) => {
  const { field, values, value, onChange } = props;

  return (
    <TextField
      type={field.type}
      fullWidth
      required={field.required}
      name={field.id}
      label={field.label}
      value={value || ""}
      error={get(values, "validateErrors", {}).hasOwnProperty(field.id)}
      helperText={get(
        values,
        `validateErrors.${field.id}.message`,
        get(field, "hint", "")
      )}
      onChange={onChange}
    />
  )
};

export default Text;
