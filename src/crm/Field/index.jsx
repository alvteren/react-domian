import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, size, forEach, toArray } from "lodash";
import getVisibleValues from "./getVisibleValues";
import fieldValidate from "../../util/formValidate";

import { saveToStore, saveFile } from "../actions/form";
import { validateFormError } from "../actions/validate";
import { savePropToServer } from "../actions/crm";

import FieldViewImage from "./view/Image";
import FieldEditImage from "./edit/Image";
import FieldEditSelect from "./edit/SelectField";
import SwitchFieldEdit from "./edit/SwitchField";
import LocationFieldEdit from "./edit/Location";
import Date from "./edit/DateField";
import Tel from "./edit/Tel";
import Text from "./edit/Text"
import TextArea from "./edit/TextArea";

import styles from "./Field.module.css";

import { withStyles } from "material-ui/styles";
import { Grid, IconButton } from "material-ui";
import ModeEditIcon from "material-ui-icons/ModeEdit";
import Done from "material-ui-icons/Done";

import { ListItem, ListItemText } from "material-ui/List";

class Field extends React.PureComponent {
  state = {
    edit: get(this.props, "edit", false),
    needSave: false
  };

  onStartEdit = () => {
    this.setState({ edit: true, needSave: true });
  };
  onSave = propId => e => {
    const { fields, values, entityId } = this.props;
    const error = fieldValidate({ form: values, fields, entityId, propId });
    if (error instanceof Object) {
      this.props.formValidateError(error);
      return;
    }
    this.props.saveToServer(propId);
    if (this.state.needSave) this.setState({ edit: false, needSave: false });
  };
  onChange = e => {
    const arValue = e.target ? e.target : e;
    this.props.handleChange(arValue);
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
    const { id, field, values, value, classes, can, gridType, validity, elementId, ...other } = this.props;
    const { edit, needSave } = this.state;
    const canEdit = get(can, "edit", false);
    const isDepended = get(field, "depended", null) !== null;
    const col = gridType ? gridType : 6;
    const validateError = get(validity, `${elementId}.validateErrors.${id}`, null);

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

    const visibleValues = getVisibleValues(field, values);
    if (field.type === "custom" && field["component"] && visibleValues.show) {
      return React.createElement(field["component"], {
        ...this.props,
        state: this.state,
        onChange: this.onChange,
        onStartEdit: this.onStartEdit,
        onSave: this.onSave
      });
    }

    if (edit && canEdit) {
      const formControl = needSave
        ? classes.formControlWithButton
        : classes.formControl;

      if (visibleValues.show || visibleValues.disabled) {
        if (field.type === "select") {
          if (visibleValues.items && size(visibleValues.items) > 0) {
            return (
              <Grid item xs={12} sm={col}>
                <div className={classes.valueWrapper}>
                  <FieldEditSelect
                    id={id}
                    value={value || ""}
                    field={field}
                    visibleValues={visibleValues.items}
                    onChange={this.onChange}
                    formControl={formControl}
                    validateError={validateError}
                    error={get(values, `validateErrors.${field.id}`, false)}
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
                value={Boolean(value)}
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
                validateError={validateError}
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
              <TextArea
                className={formControl}
                onChange={this.onChange}
                field={field}
                value={value}
                validateError={validateError}
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
        if (field.type === "date") {
          return (
            <Grid item xs={12} sm={col} className={classes.valueWrapper}>
              <Date
                field={field}
                value={value}
                onChange={this.onChange}
                visibleValues={visibleValues}
                validateError={validateError}
              />
            </Grid>
          );
        }
        if (field.type === "tel") {
          return (
            <Grid item xs={12} sm={col} className={classes.valueWrapper}>
              <Tel
                className={formControl}
                field={field}
                value={value || ""}
                values={values}
                onChange={this.onChange}
                validateError={validateError}
              />
            </Grid>
          )
        }
        return (
          <Grid item xs={12} sm={col} className={classes.valueWrapper}>
            <Text
              className={formControl}
              field={field}
              value={value}
              values={values}
              onChange={this.onChange}
              validateError={validateError}
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
          if (field.items) {
            const listValue = field.hasOwnProperty("items")
              ? get(field.items, value, null) ||
                get(field.items, String(value).toLowerCase(), null)
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
  const { id, entityId, elementId, gridType } = ownProps;
  const { fields, values, validity } = state.crm[entityId];

  const field = get(fields, id, false);

  const elementValues = get(values, elementId, null);
  const value = elementValues != null ? get(elementValues, id, null) : null;
  const can = elementValues != null ? get(elementValues, "can", {}) : {};

  if (elementId === 0) {
    can.edit = true;
  }

  return {
    fields,
    field,
    values: elementValues,
    value,
    can,
    gridType,
    validity,
    elementId
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { field } = stateProps;
  const { entityId, elementId } = ownProps;
  const name = field.id;

  return {
    ...ownProps,
    ...stateProps,
    handleChange: arValue => {
      const { value } = arValue;
      dispatch(saveToStore({ entityId, elementId, name, value }));
    },
    handleChangeSwitch: (e, checked) => {
      dispatch(saveToStore({ entityId, elementId, name, value: checked }));
    },
    saveFile: file => {
      dispatch(saveFile({ entityId, elementId, name: "photo", file }));
    },
    saveToServer: () => {
      const { value } = stateProps;
      dispatch(savePropToServer({ entityId, elementId, name, value }));
    },
    formValidateError(errors) {
      dispatch(validateFormError({ entityId, elementId, errors }));
    }
  };
};
export const stylesMUI = theme => ({
  formControl: {
    minWidth: 200,
    width: "100%",
    flexBasis: "auto"
  },
  valueWrapper: {
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between",
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
  field: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  entityId: PropTypes.string.isRequired,
  elementId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default connect(
  mapStateToProps,
  null,
  mergeProps
)(withStyles(stylesMUI)(Field));
