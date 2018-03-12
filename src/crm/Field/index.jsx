import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, filter, size, map, isObject } from "lodash";

import { saveToStore } from "../actions/form";

import styles from "./Field.module.css";

import Dropzone from "react-dropzone";

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
    if (this.state.needSave) this.setState({ edit: false, needSave: false });
  };
  onChange = e => {
    this.props.handleChange(e);
  };

  onImageDrop = acceptedFiles => {
    console.log(acceptedFiles);
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
          let linkedValue = get(values, field.depended, null);
          if (isObject(linkedValue) && linkedValue.hasOwnProperty("id")) {
            linkedValue = linkedValue.id;
          }
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

      if (visibleValues) {
        if (field.type === "select" && size(visibleValues) > 0) {
          const bNativeSelect = size(visibleValues) > 4;
          return (
            <Grid item xs={12} sm={6}>
              <div className={classes.valueWrapper}>
                <FormControl fullWidth className={formControl} key={id}>
                  <InputLabel htmlFor={id} required={field.required}>
                    {field.label}
                  </InputLabel>
                  <Select
                    value={value}
                    onChange={this.onChange}
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
                {needSave && (
                  <IconButton
                    onClick={this.onSave}
                    className={classes.buttonSave}
                    color="inherit"
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
                onChange={this.onChange}
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
                    onChange={this.onChange}
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
        if (field.type === "image") {
          return (
            <Grid item xs={12}>
              <div>
                <span>Фото</span>
                {needSave && (
                  <IconButton
                    onClick={this.onSave}
                    className={classes.buttonSave}
                    color="primary"
                  >
                    <Done />
                  </IconButton>
                )}
              </div>
              {size(value) > 0 && (
                <div className={styles.containerPhoto}>
                  {map(value, arPhoto => {
                    return (
                      <div
                        className={styles.previewPhoto}
                        style={{ backgroundImage: `url(${arPhoto.preview})` }}
                        key={arPhoto.value}
                      />
                    );
                  })}
                </div>
              )}
              <Dropzone
                multiple={false}
                accept="image/*"
                onDrop={this.onImageDrop}
              >
                <p>Drop an image or click to select a file to upload.</p>
              </Dropzone>
            </Grid>
          );
        }
      }
    } else {
      if (field) {
        if (field.type === "image") {
          return (
            <Grid item xs={12}>
              <div>
                <span>Фото</span>

                <IconButton
                  onClick={this.onStartEdit}
                  className={classes.buttonEdit}
                >
                  <ModeEditIcon />
                </IconButton>
              </div>
              {size(value) > 0 && (
                <div>
                  {map(value, arPhoto => {
                    return (
                      <div
                        className={styles.previewPhoto}
                        style={{ backgroundImage: `url(${arPhoto.preview})` }}
                        key={arPhoto.value}
                      />
                    );
                  })}
                </div>
              )}
            </Grid>
          );
        } else {
          const formatValue = () => {
            if (field.type === "select") {
              const listValue = field.hasOwnProperty("items")
                ? get(field.items, value, null)
                : null;
              return listValue ? listValue.label : "";
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
  const { fields, data, values } = state.crm.objects;
  const { id, match } = ownProps;
  const objectId = match.params.id;
  const field = get(fields, id, false);
  const objectValues = get(values, objectId, null);
  const value = objectValues != null ? get(objectValues, id, null) : null;

  return {
    objectId,
    field,
    values: objectValues,
    value
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { field, values } = stateProps;
  const elementId = stateProps.objectId;

  return {
    ...ownProps,
    ...stateProps,
    handleChange: e => {
      const { name, value } = e.target;
      dispatch(saveToStore({ id: "objects", elementId, name, value }));
    },
    handleChangeSwitch: (e, checked) => {
      const { name } = e.target;
      dispatch(saveToStore({ id: "objects", elementId, name, value: checked }));
    }
  };
};
const stylesMUI = theme => ({
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
    width: `calc(100% - 48px)`,
    padding: 0
  },
  buttonEdit: {
    opacity: 0.1,
    marginLeft: theme.spacing.unit,
    cursor: "pointer",
    "&:hover": {
      opacity: 1
    }
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
export default connect(mapStateToProps, null, mergeProps)(
  withStyles(stylesMUI)(Field)
);
