import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { get, filter, size } from "lodash";

import { saveToStore } from "../../actions/form";

import { withStyles } from "material-ui/styles";
import { TextField, Select, Grid, Switch } from "material-ui";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Radio, { RadioGroup } from "material-ui/Radio";
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import Typography from "material-ui/Typography";

import { map } from "lodash";
const styles = theme => ({
  root: {},
  container: {
    alignItems: "flex-start"
  },
  tabs: {
    width: `calc(100% + ${theme.spacing.unit * 6}px)`,
    margin: `0 -${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  formControl: {
    minWidth: 200,
    width: "100%",
    whiteSpace: "nowrap"
  }
});

class Form extends React.Component {
  state = {
    openedSection: "main"
  };
  handleChangeTab = (event, value) => {
    this.setState({ openedSection: value });
  };
  render() {
    const {
      fields,
      fieldsSections,
      classes,
      handleChange,
      handleChangeSwitch
    } = this.props;
    const { openedSection } = this.state;

    if (size(fields) === 0) {
      return <div />;
    }
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.tabs}>
          <Tabs
            value={openedSection}
            onChange={this.handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {map(fieldsSections, (section, code) => {
              return <Tab label={section.name} value={code} />;
            })}
          </Tabs>
        </AppBar>
        <div>
          <Grid container className={classes.container}>
            {map(fieldsSections[openedSection].fields, (val, id) => {
              const field = get(fields, id);
              const visibleValues = () => {
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

              if (field.type === "select") {
                return (
                  size(visibleValues()) > 0 && (
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className={classes.formControl}
                        key={id}
                      >
                        <InputLabel htmlFor={id} required={field.required}>
                          {field.label}
                        </InputLabel>
                        <Select
                          value={get(field, "value", "")}
                          onChange={handleChange}
                          input={<Input name={id} id={id} />}
                        >
                          {map(visibleValues(), item => {
                            return (
                              <MenuItem value={item.value} key={item.value}>
                                {item.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {field.hint && (
                          <FormHelperText>{field.hint}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )
                );
              }
              if (field.type === "text" && visibleValues()) {
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
              if (field.type === "switch" && visibleValues()) {
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
            })}
          </Grid>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { fields, fieldsSections } = state.crm.objects;
  return { fields, fieldsSections };
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
Form.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Form)
);
