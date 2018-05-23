import React from "react";
import { connect } from "react-redux";

import Search from "./Search";

import { Grid } from "material-ui"
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

class Street extends React.PureComponent {
  state = {
    open: false
  }

const onFocus = () => {
    this.setState({open:true});
  };
  render(){
  const { id, value, field, onChange, formControl } = this.props;
  const onChangeValue = value => {
    onChange({ target: { name: id, value: value } });
  };
  return (
    <Grid xs={6}>
      <FormControl fullWidth className={formControl} key={id}>
        <InputLabel htmlFor={id} required={field.required}>
          {field.label}
        </InputLabel>
        <Input value={value} onFocus={onFocus} />
        {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
      </FormControl>
      <Search value={value} onChangeValue={onChangeValue} />
    </Grid>
  );
  }
};

export default connect(null)(Street);
