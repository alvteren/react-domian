import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, filter, size, map } from "lodash";

import { saveToStore } from "../../actions/form";

import { withStyles } from "material-ui/styles";
import { TextField, Select, Grid, Switch } from "material-ui";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Radio, { RadioGroup } from "material-ui/Radio";
import {
  FormControl,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";

import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";

class Field extends React.Component {
  state = {
    edit: get(this.props, "edit", false)
  };

  render() {
    const {
      id,
      fields,
      classes,
      handleChange,
      handleChangeSwitch
    } = this.props;

    const { edit } = this.state;
    const field = get(fields, id);
    if (edit) {
      const getVisibleValues = () => {
        if (get(field, "depended", null) !== null) {
          const linkedValue = fields[field.depended].value;
          if (get(field, "items", false)) {
            return filter(field.items, {
              link: linkedValue
            });
          } else {
            return linkedValue === field.link;
          }
        }

        return get(field, "items", true);
      };
      const visibleValues = getVisibleValues();
      if (visibleValues) {
        if (field.type === "select" && size(visibleValues) > 0) {
          return (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className={classes.formControl} key={id}>
                <InputLabel htmlFor={id} required={field.required}>
                  {field.label}
                </InputLabel>
                <Select
                  value={get(field, "value", "")}
                  onChange={handleChange}
                  input={<Input name={id} id={id} />}
                >
                  {map(visibleValues, item => {
                    return (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Select>
                {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
              </FormControl>
            </Grid>
          );
        }
        if (field.type === "text") {
          return (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required={field.required}
                name={id}
                label={field.label}
                onChange={handleChange}
                value={get(field, "value", "")}
                helperText={get(field, "hint", "")}
              />
            </Grid>
          );
        }
        if (field.type === "switch") {
          return (
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name={id}
                    checked={get(field, "value", false)}
                    onChange={handleChangeSwitch}
                    aria-label={id}
                  />
                }
                label={field.label}
              />
            </Grid>
          );
        }
      }
    } else {
      if (field.value) {
        if (field.type === "image") {
        } else {
          const formatValue = () => {
            if (field.type === "select") {
              return field.items[field.value].label;
            }
            return field.value;
          };
          const value = formatValue();
          console.log("value", value);

          return (
            <Grid item xs={12} sm={6}>
              <ListItem>
                <ListItemText primary={value} secondary={field.label} />
              </ListItem>
            </Grid>
          );
        }
      }
    }

    return <span />;
  }
}
const mapStateToProps = (state, ownProps) => {
  const { fields } = state.crm.objects;
  return { fields };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    handleChange: e => {
      const { name, value } = e.target;
      dispatch(saveToStore({ id: "objects", name, value }));
    },
    handleChangeSwitch: (e, checked) => {
      const { name } = e.target;
      dispatch(saveToStore({ id: "objects", name, value: checked }));
    }
  };
};
const styles = theme => ({
  formControl: {
    minWidth: 200,
    width: "100%",
    whiteSpace: "nowrap"
  }
});
Field.propTypes = {
  field: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Field)
);
