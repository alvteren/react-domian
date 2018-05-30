import React from "react";
import { TextField } from "material-ui";
import {get} from "lodash";

const TextArea = (props) => {
  const { field, value, onChange, validateError } = props;

  return (
    <TextField
      type="text"
      fullWidth
      required={field.required}
      name={field.id}
      label={field.label}
      onChange={onChange}
      value={value || ""}
      multiline
      rowsMax="4"
      error={Boolean(validateError)}
      helperText={get(validateError, "message", get(field, "hint", ""))}
    />
  )
};

export default TextArea;