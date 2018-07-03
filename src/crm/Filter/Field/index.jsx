import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, size } from "lodash";
import getVisibleValues from "./getVisibleValues";

import { saveToStore } from "../../actions/filter";

import FieldEditSelect from "./edit/SelectField";
import SwitchFieldEdit from "./edit/SwitchField";
import LocationFieldEdit from "./edit/Location";
import Date from "./edit/DateField";
import Tel from "./edit/Tel";
import Text from "./edit/Text";
import NumberRange from "./edit/NumberRange";

import { withStyles } from "material-ui/styles";
import { Grid, IconButton, Tooltip } from "material-ui";
import CloseIcon from "material-ui-icons/Close";

class Field extends React.PureComponent {
  clearValue = id => () => {
    this.onChange({ name: id, value: null });
  };

  onChange = e => {
    const arValue = e.target ? e.target : e;
    this.props.handleChange(arValue);
  };

  render() {
    const {
      id,
      field,
      values,
      value,
      classes,
      can,
      gridType,
      elementId,
      entityId,
      ...other
    } = this.props;

    const col = gridType ? gridType : 6;

    if (field === false) {
      return <span />;
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

    const formControl = Boolean(value)
      ? classes.formControlWithButton
      : classes.formControl;

    if (visibleValues.show || visibleValues.disabled) {
      if (field.type === "select") {
        if (visibleValues.items && size(visibleValues.items) > 0) {
          return (
            <Grid item xs={12} sm={col}>
              <div className={classes.valueWrapper}>
                <FieldEditSelect
                  visibleValues={visibleValues.items}
                  onChange={this.onChange}
                  formControl={formControl}
                  {...{ id, entityId, elementId, field, value }}
                />
                {Boolean(value) && (
                  <Tooltip title="Сбросить значение" delay={300}>
                    <IconButton
                      onClick={this.clearValue(id)}
                      className={classes.buttonSave}
                      color="inherit"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
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

            {Boolean(value) && (
              <IconButton
                onClick={this.onSave(id)}
                className={classes.buttonSave}
                color="inherit"
              >
                <CloseIcon />
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
            {Boolean(value) && (
              <IconButton
                onClick={this.onSave(id)}
                className={classes.buttonSave}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Grid>
        );
      }
      if (field.type === "textarea") {
        return (
          <Grid item xs={12} sm={col} className={classes.valueWrapper}>
            <Text
              className={formControl}
              field={field}
              value={value}
              values={values}
              onChange={this.onChange}
            />
            {Boolean(value) && (
              <IconButton
                onClick={this.onSave(id)}
                className={classes.buttonSave}
                color="primary"
              >
                <CloseIcon />
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
            />
          </Grid>
        );
      }
      if (field.type === "number") {
        return (
          <Grid item xs={12} className={classes.valueWrapper}>
            <NumberRange
              className={formControl}
              field={field}
              values={values}
              {...{ id, entityId, elementId, field }}
              onChange={this.onChange}
            />
          </Grid>
        );
      }
      return (
        <Grid item xs={12} sm={col} className={classes.valueWrapper}>
          <Text
            className={formControl}
            onChange={this.onChange}
            {...{ id, entityId, elementId, field, value }}
          />
          {Boolean(value) && (
            <IconButton
              onClick={this.clearValue(id)}
              className={classes.buttonSave}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Grid>
      );
    }

    return <span />;
  }
}
const mapStateToProps = (state, ownProps) => {
  const { id, entityId, gridType } = ownProps;
  const { filter } = state.crm[entityId];
  const { fields, values } = filter;

  const field = get(fields, id, false);

  const value = values != null ? get(values, id, null) : null;

  return {
    fields,
    field,
    values,
    value,
    gridType
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { field } = stateProps;
  const { entityId } = ownProps;
  const name = field.id;

  return {
    ...ownProps,
    ...stateProps,
    handleChange: arValue => {
      const { value, name: inputName } = arValue;
      dispatch(saveToStore({ entityId, name: inputName || name, value }));
    },
    handleChangeSwitch: (e, checked) => {
      dispatch(saveToStore({ entityId, name, value: checked }));
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
    alignItems: "baseline",
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
