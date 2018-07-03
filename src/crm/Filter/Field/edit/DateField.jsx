import React from "react";
import { TextField } from "material-ui";
import { get } from "lodash";

class Date extends React.PureComponent {
  render() {
    const { field, value, onChange } = this.props;
    return (
      <TextField
        id={field.id}
        label={field.label}
        type={field.type === "datetime" ? "datetime-local" : field.type}
        defaultValue={value}
        onChange={onChange}
        InputLabelProps={{
          shrink: true
        }}
        helperText={String(field.hint)}
      />
    );
  }
}

export default Date;
