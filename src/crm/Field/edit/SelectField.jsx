import React from "react";

import { size, map } from "lodash";

import { Select } from "material-ui";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";

const SelectField = props => {
  const { id, value, field, visibleValues, onChange, formControl } = props;
  const bNativeSelect = size(visibleValues) > 4;

  return (
    <FormControl fullWidth className={formControl} key={id}>
      <InputLabel htmlFor={id} required={field.required}>
        {field.label}
      </InputLabel>
      <Select
        value={value || ""}
        onChange={onChange}
        native={bNativeSelect}
        input={<Input name={id} id={id} />}
      >
        {map(visibleValues, item => {
          return bNativeSelect ? (
            <option value={item.value} key={item.value}>
              {item.label}
            </option>
          ) : (
            <MenuItem value={item.value} key={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
      {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
    </FormControl>
  );
};
export default SelectField;
