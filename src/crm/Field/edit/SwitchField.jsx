import React from "react";

import { Switch } from "material-ui";
import { FormControlLabel } from "material-ui/Form";

const SwitchField = props => {
  const { id, value, field, onChange, formControl } = props;

  return (
    <FormControlLabel
      className={formControl}
      control={
        <Switch name={id} checked={value} onChange={onChange} aria-label={id} />
      }
      label={field.label}
    />
  );
};
export default SwitchField;
