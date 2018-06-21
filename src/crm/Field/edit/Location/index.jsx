import React, { Fragment } from "react";
import { connect } from "react-redux";

import LocationSearch from "./Search";

import { get } from "lodash";

import { TextField } from "material-ui";

import { openSearch } from "../../../actions/form";

export const entitySearch = "location";

const Location = props => {
  const onFocus = () => {
    props.openSearch();
  };
  const { id, value, field, onChange, formControl, validateError } = props;
  const onChangeValue = value => {
    onChange({ target: { name: id, value: value } });
  };

  const locationName = get(value, "name", "");
  const locationId = String(get(value, "value", ""));

  const hint = get(validateError, "message", get(field, "hint", ""));

  return (
    <Fragment>
      <TextField
        className={formControl}
        fullWidth
        required={field.required}
        name={field.id}
        label={field.label}
        value={locationName}
        error={Boolean(validateError)}
        onFocus={onFocus}
        helperText={hint}
      />
      <LocationSearch value={locationId} onChangeValue={onChangeValue} />
    </Fragment>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    openSearch: () => {
      dispatch(openSearch({ entitySearch }));
    }
  };
};
export default connect(
  null,
  mapDispatchToProps
)(Location);
