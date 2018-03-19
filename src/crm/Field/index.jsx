import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, filter, size, map, isObject } from "lodash";

import { saveToStore, saveFile } from "../actions/form";

import FieldViewImage from "./view/Image";
import FieldEditImage from "./edit/Image";
import FieldEditSelect from "./edit/SelectField";
import SwitchFieldEdit from "./edit/SwitchField";

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
  onSave = e => {
    if (this.state.needSave) this.setState({ edit: false, needSave: false });
  };
  onChange = e => {
    this.props.handleChange(e);
  };

  handleFiles = files => {
    if (files.length) {
      map(files, file => {
        this.props.saveFile(file);
        return true;
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

    if (field === false) {
      return <span />;
    }
    if (field.type === "image") {
      return (
        <Grid item xs={12}>
          <div className={styles.photoTitle}>
            <span>Фото</span>
          </div>
          {canEdit && <FieldEditImage id={id} />}
          <FieldViewImage value={value} />
        </Grid>
      );
    }
    if (edit && canEdit) {
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
          return (
            <Grid item xs={12} sm={6}>
              <div className={classes.valueWrapper}>
                <FieldEditSelect
                  id={id}
                  value={value}
                  field={field}
                  visibleValues={visibleValues}
                  onChange={this.onChange}
                  formControl={formControl}
                />
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
    } else {
      const isShowField =
        field &&
        (canEdit || (value !== null && value !== "" && size(value) > 0));
      if (isShowField) {
        const formatValue = () => {
          if (field.type === "select") {
            const listValue = field.hasOwnProperty("items")
              ? get(field.items, value, null)
              : null;
            return listValue ? listValue.label : "";
          }
          if (field.type === "switch") {
            return value === true || value === "Y" ? "Да" : "Нет";
          }
          return value;
        };
        return (
          <Grid item xs={12} sm={6}>
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
  const { fields, values } = state.crm.objects;
  const { id, match } = ownProps;
  const objectId = match.params.id;
  const field = get(fields, id, false);
  const objectValues = get(values, objectId, null);
  const value = objectValues != null ? get(objectValues, id, null) : null;
  const can = objectValues != null ? get(objectValues, "can", {}) : {};

  return {
    objectId,
    field,
    values: objectValues,
    value,
    can
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
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
    },
    saveFile: file => {
      dispatch(saveFile({ id: "objects", elementId, name: "photo", file }));
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
