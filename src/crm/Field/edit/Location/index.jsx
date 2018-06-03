import React, { Fragment } from "react";
import { connect } from "react-redux";

import LocationSearch from "./Search";

import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

import { openLocationSearch } from "../../../actions/form";

const Location = props => {
  const onFocus = () => {
    props.openSearch();
  };
  const { id, value, field, onChange, formControl } = props;
  const onChangeValue = value => {
    onChange({ target: { name: id, value: value } });
  };

  const locationName =
    value && value.hasOwnProperty("name") && value.name ? value.name : "";
  const locationId =
    value && value.hasOwnProperty("value") && value.value ? String(value.value) : "";

  return (
    <Fragment>
      <FormControl fullWidth className={formControl} key={id}>
        <InputLabel htmlFor={id} required={field.required}>
          {field.label}
        </InputLabel>
        <Input value={locationName} onFocus={onFocus} />
        {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
      </FormControl>
      <LocationSearch value={locationId} onChangeValue={onChangeValue} />
    </Fragment>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    openSearch: () => {
      dispatch(openLocationSearch());
    }
  };
};
export default connect(null, mapDispatchToProps)(Location);
