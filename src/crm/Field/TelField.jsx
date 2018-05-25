import React from "react";
import { TextField } from "material-ui";
import MaskedInput from "react-text-mask";

import {get} from "lodash";

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      // prettier-ignore
      mask={["+", "7", "(", /[1-9]/, /\d/, /\d/, ")", /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
      //showMask
    />
  );
}

class TelField extends React.PureComponent {
  state = {
    tel: ""
  };

  handleTelInputChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
    this.props.onChange(event);
  };

  onTelInputFocus = event => {
    if (!this.state.tel) {
      this.setState({ tel: "9" });
      event.target.selectionStart = 2; // not working
    }
  };

  onTelInputBlur = event => {
    if (this.state.tel === "9") {
      this.setState({ tel: "" });
    }
  };

  render() {
    const { id, field, values, value } = this.props;

    return (
      <TextField
        type="tel"
        fullWidth
        required={field.required}
        name={id}
        label={field.label}
        value={value || this.state.tel}
        error={get(values, "validateErrors", {}).hasOwnProperty(field.id)}
        helperText={get(
          values,
          `validateErrors.${field.id}.message`,
          get(field, "hint", "")
        )}
        onFocus={this.onTelInputFocus}
        onBlur={this.onTelInputBlur}
        onChange={this.handleTelInputChange("tel")}
        InputProps={
          { inputComponent: TextMaskCustom }
        }
      />
    )
  }
}

export default TelField;
