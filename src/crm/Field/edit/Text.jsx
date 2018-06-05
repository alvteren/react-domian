import React from "react";
import { TextField } from "material-ui";
import {get} from "lodash";

const Text = (props) => {
  const { field, value, onChange, validateError } = props;

  return (
    <TextField
      type={field.type}
      fullWidth
      required={field.required}
      name={field.id}
      label={field.label}
      value={value || ""}
      error={Boolean(validateError)}
      helperText={
        get(validateError,
          "message",
          get(field, "hint", "")
      )}
      onChange={onChange}
    />
  )
};

export default Text;
