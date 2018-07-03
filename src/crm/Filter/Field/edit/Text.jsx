import React from "react";
import { TextField } from "material-ui";
import { get } from "lodash";

const Text = props => {
  const { field, value, onChange } = props;

  return (
    <TextField
      type={field.type}
      fullWidth
      required={field.required}
      name={field.id}
      label={field.label}
      value={String(value) || ""}
      helperText={String(field.hint)}
      onChange={onChange}
    />
  );
};

export default Text;
