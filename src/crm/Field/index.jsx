import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, filter, size, isObject, forEach } from "lodash";
import { noStrictIncludes, noStrictExcludes } from "../../util/collection";

import { saveToStore, saveFile, saveToServer } from "../actions/form";

import FieldViewImage from "./view/Image";
import FieldEditImage from "./edit/Image";
import FieldEditSelect from "./edit/SelectField";
import SwitchFieldEdit from "./edit/SwitchField";
import LocationFieldEdit from "./edit/Location";

import styles from "./Field.module.css";

import { withStyles } from "material-ui/styles";
import { TextField, Grid, IconButton } from "material-ui";
import ModeEditIcon from "material-ui-icons/ModeEdit";
import Done from "material-ui-icons/Done";

import { ListItem, ListItemText } from "material-ui/List";

class Field extends React.Component {
  state = {
    edit: get(this.props, "edit", false),
    needSave: false
  };

  onStartEdit = () => {
    this.setState({ edit: true, needSave: true });
  };
  onSave = id => e => {
    this.props.saveToServer(id);
    if (this.state.needSave) this.setState({ edit: false, needSave: false });
  };
  onChange = e => {
    this.props.handleChange(e);
  };

  handleFiles = files => {
    if (files.length) {
      forEach(files, file => {
        this.props.saveFile(file);
      });
    }
  };

  onChangeFile = e => {
    this.handleFiles(e.target.files);
  };

  onImageDrop = acceptedFiles => {
    this.handleFiles(acceptedFiles);
  };

  render() {
    const { id, field, values, value, classes, can } = this.props;

    const { edit, needSave } = this.state;
    const canEdit = get(can, "edit", false);
    const isDepended = get(field, "depended", null) !== null;

    const getVisibleValues = () => {
      if (isDepended) {
        if (values == null) return null;
        let linkedValue = get(values, field.depended, null);
        if (isObject(linkedValue) && linkedValue["value"]) {
          linkedValue = linkedValue.value;
        } else if (isObject(linkedValue) && linkedValue["id"]) {
          linkedValue = linkedValue.id;
        }
        if (field["link"]) {
          return noStrictIncludes(field.link, linkedValue) ? true : null;
        }
        if (field["exclude_link"]) {
          return noStrictExcludes(field.exclude_link, linkedValue)
            ? true
            : null;
        }
        if (get(field, "items", false)) {
          const items = filter(field.items, item => {
            const itemLinkedValue = item["depended"]
              ? item.depended
              : linkedValue;
            if (item["link"]) {
              return noStrictIncludes(item.link, itemLinkedValue);
            }
            if (item["exclude_link"]) {
              return noStrictExcludes(item.exclude_link, itemLinkedValue);
            }
          });
          return size(items) > 0 ? items : null;
        }
      }

      return get(field, "items", true);
    };

    if (field === false) {
      return <span />;
    }

    if (field.type === "image") {
      return (
        <Grid item xs={12}>
          <div className={styles.photoTitle}>
            <span>Фото</span>
          </div>
          {canEdit && (
            <FieldEditImage
              id={id}
              onChangeFile={this.onChangeFile}
              onImageDrop={this.onImageDrop}
            />
          )}
          <FieldViewImage value={value} />
        </Grid>
      );
    }

    const visibleValues = getVisibleValues();

    if (edit && canEdit) {
      const formControl = needSave
        ? classes.formControlWithButton
        : classes.formControl;

      if (visibleValues) {
        if (field.type === "select") {
          if (size(visibleValues) > 0) {
            return (
              <Grid item xs={12} sm={6}>
                <div className={classes.valueWrapper}>
                  <FieldEditSelect
                    id={id}
                    value={value || ""}
                    field={field}
                    visibleValues={visibleValues}
                    onChange={this.onChange}
                    formControl={formControl}
                  />
                  {needSave && (
                    <IconButton
                      onClick={this.onSave(id)}
                      className={classes.buttonSave}
                      color="inherit"
                    >
                      <Done />
                    </IconButton>
                  )}
                </div>
              </Grid>
            );
          } else {
            return <span />;
          }
        }
        if (field.type === "switch") {
          return (
            <Grid item xs={12} sm={6} className={classes.valueWrapper}>
              <SwitchFieldEdit
                formControl={formControl}
                id={id}
                value={value}
                onChange={this.onChange}
                field={field}
              />

              {needSave && (
                <IconButton
                  onClick={this.onSave(id)}
                  className={classes.buttonSave}
                  color="primary"
                >
                  <Done />
                </IconButton>
              )}
            </Grid>
          );
        }
        if (field.type === "location") {
          return (
            <Grid item xs={12} sm={6} className={classes.valueWrapper}>
              <LocationFieldEdit
                formControl={formControl}
                id={id}
                value={value}
                onChange={this.onChange}
                field={field}
              />

              {needSave && (
                <IconButton
                  onClick={this.onSave(id)}
                  className={classes.buttonSave}
                  color="primary"
                >
                  <Done />
                </IconButton>
              )}
            </Grid>
          );
        }
        if (field.type === "textarea") {
          return (
            <Grid item xs={12} sm={12} className={classes.valueWrapper}>
              <TextField
                type="text"
                className={formControl}
                fullWidth
                required={field.required}
                name={id}
                label={field.label}
                onChange={this.onChange}
                value={value || ""}
                multiline
                rowsMax="4"
                helperText={get(field, "hint", "")}
              />
              {needSave && (
                <IconButton
                  onClick={this.onSave(id)}
                  className={classes.buttonSave}
                  color="primary"
                >
                  <Done />
                </IconButton>
              )}
            </Grid>
          );
        }
        return (
          <Grid item xs={12} sm={6} className={classes.valueWrapper}>
            <TextField
              type={field.type}
              className={formControl}
              fullWidth
              required={field.required}
              name={id}
              label={field.label}
              onChange={this.onChange}
              value={value || ""}
              helperText={get(field, "hint", "")}
            />
            {needSave && (
              <IconButton
                onClick={this.onSave(id)}
                className={classes.buttonSave}
                color="primary"
              >
                <Done />
              </IconButton>
            )}
          </Grid>
        );
      }
    } else {
      const isShowedField =
        (field &&
          ((canEdit && isDepended && visibleValues !== null) ||
            (canEdit && !isDepended))) ||
        (!canEdit && value != null && value !== "");

      if (isShowedField) {
        const formatValue = () => {
          // debugger;
          if (field.items) {
            const listValue = field.hasOwnProperty("items")
              ? get(field.items, value, null) || get(field.items, String(value).toLowerCase(), null)
              : null;
            return listValue ? listValue.label : "";
          }
          if (field.type === "switch") {
            return value === true || value === "Y" ? "Да" : "Нет";
          }
          if (field.type === "location") {
            return value.name;
          }
          return value;
        };
        const col = field.type === "textarea" ? 12 : 6;
        return (
          <Grid item xs={12} sm={col}>
            <div
              className={classes.valueWrapper}
              onClick={() => {
                canEdit && this.onStartEdit();
              }}
            >
              <ListItem className={classes.value}>
                <ListItemText
                  primary={<Fragment>{formatValue()}</Fragment>}
                  secondary={field.label}
                />
              </ListItem>

              {canEdit && (
                <IconButton className={classes.buttonEdit}>
                  <ModeEditIcon />
                </IconButton>
              )}
            </div>
          </Grid>
        );
      }
    }

    return <span />;
  }
}
const mapStateToProps = (state, ownProps) => {
  const { id, match, entityId } = ownProps;
  const { fields, values } = state.crm[entityId];

  const params = get(match, "params", false);
  const field = get(fields, id, false);
  const objectId = get(params, "id", 0);
  const objectValues = get(values, objectId, null);
  const value = objectValues != null ? get(objectValues, id, null) : null;
  const can = objectValues != null ? get(objectValues, "can", {}) : {};

  if (objectId === 0) {
    can.edit = true;
  }

  return {
    objectId,
    field,
    values: objectValues,
    value,
    can,
    entityId
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { objectId: elementId, field } = stateProps;
  const name = field.id;

  return {
    ...ownProps,
    ...stateProps,
    handleChange: e => {
      const { value } = e.target;
      dispatch(saveToStore({ id: "objects", elementId, name, value }));
    },
    handleChangeSwitch: (e, checked) => {
      dispatch(saveToStore({ id: "objects", elementId, name, value: checked }));
    },
    saveFile: file => {
      dispatch(saveFile({ id: "objects", elementId, name: "photo", file }));
    },
    saveToServer: () => {
      const { value } = stateProps;
      dispatch(saveToServer({ id: "objects", elementId, name, value }));
    }
  };
};
const stylesMUI = theme => ({
  formControl: {
    minWidth: 200,
    width: "100%",
    flexBasis: "auto"
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
    flexBasis: "auto"
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
  },
  iconButton: {
    marginLeft: theme.spacing.unit
  }
});
Field.propTypes = {
  classes: PropTypes.object.isRequired,
  field: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
export default connect(mapStateToProps, null, mergeProps)(
  withStyles(stylesMUI)(Field)
);
