import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { map } from "lodash";

import Field from "../../Field";

import { withStyles } from "material-ui/styles";
import { Grid } from "material-ui";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";

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
    const { fieldsSections, classes } = this.props;
    const { openedSection } = this.state;

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
            {map(fieldsSections, (section, code) => (
              <Tab label={section.name} value={code} key={code} />
            ))}
          </Tabs>
        </AppBar>
        <div>
          <Grid container className={classes.container}>
            {map(fieldsSections[openedSection].fields, (val, id) => (
              <Field id={id} key={id} edit={true} />
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { fieldsSections } = state.crm.objects;
  return { fieldsSections };
};

Form.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(connect(mapStateToProps)(Form));
