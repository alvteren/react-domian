import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, filter, size, map } from "lodash";

import { saveToStore } from "../actions/form";

import { withStyles } from "material-ui/styles";
import { TextField, Select, Grid, Switch, IconButton } from "material-ui";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import ModeEditIcon from "material-ui-icons/ModeEdit";
import Done from "material-ui-icons/Done";
import {
  FormControl,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";

import { ListItem, ListItemText } from "material-ui/List";

class Field extends React.Component {
  state = {
    edit: get(this.props, "edit", false),
    needSave: false
  };

  onStartEdit = () => {
    this.setState({ edit: true, needSave: true });
  };
  onSave = e => {
    this.props.handleChange(e);
    if (this.state.needSave) this.setState({ edit: false, needSave: false });
  };

  render() {
    const { id, field, values, value, classes } = this.props;

    const { edit, needSave } = this.state;

    if (field === false) {
      return <span />;
    }
    if (edit) {
      const getVisibleValues = () => {
        if (get(field, "depended", null) !== null) {
          const linkedValue = get(values, field.depended, null);
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
      const formControl = needSave
        ? classes.formControlWithButton
        : classes.formControl;
      console.log("Form", visibleValues);
      if (visibleValues) {
        if (field.type === "select" && size(visibleValues) > 0) {
          return (
            <Grid item xs={12} sm={6}>
              <div className={classes.valueWrapper}>
                <FormControl fullWidth className={formControl} key={id}>
                  <InputLabel htmlFor={id} required={field.required}>
                    {field.label}
                  </InputLabel>
                  <Select
                    value={value ? value : ""}
                    onChange={this.onSave}
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
                {needSave && (
                  <IconButton
                    onClick={this.onSave}
                    className={classes.buttonSave}
                    color="accent"
                  >
                    <Done />
                  </IconButton>
                )}
              </div>
            </Grid>
          );
        }
        if (field.type === "text") {
          return (
            <Grid item xs={12} sm={6} className={classes.valueWrapper}>
              <TextField
                className={formControl}
                fullWidth
                required={field.required}
                name={id}
                label={field.label}
                onChange={this.onSave}
                value={value}
                helperText={get(field, "hint", "")}
              />
              {needSave && (
                <IconButton
                  onClick={this.onSave}
                  className={classes.buttonSave}
                  color="primary"
                >
                  <Done />
                </IconButton>
              )}
            </Grid>
          );
        }
        if (field.type === "switch") {
          return (
            <Grid item xs={12} sm={6} className={classes.valueWrapper}>
              <FormControlLabel
                className={formControl}
                control={
                  <Switch
                    name={id}
                    checked={value}
                    onChange={this.onSave}
                    aria-label={id}
                  />
                }
                label={field.label}
              />
              {needSave && (
                <IconButton
                  onClick={this.onSave}
                  className={classes.buttonSave}
                  color="primary"
                >
                  <Done />
                </IconButton>
              )}
            </Grid>
          );
        }
      }
    } else {
      if (value) {
        if (field.type === "image") {
        } else {
          const formatValue = () => {
            if (field.type === "select") {
              return field.items[value].label;
            }
            return value;
          };

          return (
            <Grid item xs={12} sm={6}>
              <div className={classes.valueWrapper} onClick={this.onStartEdit}>
                <ListItem className={classes.value}>
                  <ListItemText
                    primary={<Fragment>{formatValue()}</Fragment>}
                    secondary={field.label}
                  />
                </ListItem>
                <IconButton className={classes.buttonEdit}>
                  <ModeEditIcon />
                </IconButton>
              </div>
            </Grid>
          );
        }
      }
    }

    return <span />;
  }
}
const mapStateToProps = (state, ownProps) => {
  const { fields, values } = state.crm.objects;
  const { id } = ownProps;
  return {
    field: get(fields, id, false),
    values,
    value: get(values, id, null)
  };
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
    flexBasis: "auto",
    whiteSpace: "nowrap"
  },
  valueWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    "&:hover $buttonEdit": {
      opacity: 1
    }
  },
  formControlWithButton: {
    width: `calc(100% - 48px)`,
    flexBasis: "auto",
    whiteSpace: `nowrap`
  },
  value: {
    width: `calc(100% - 48px)`
  },
  buttonEdit: {
    opacity: 0.1,
    marginLeft: theme.spacing.unit,
    cursor: "pointer"
  },
  buttonSave: {
    maxWidth: 48,
    flex: "1 1 auto"
  }
});
Field.propTypes = {
  classes: PropTypes.object.isRequired,
  field: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Field)
);
