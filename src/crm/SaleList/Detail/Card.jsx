import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import { Grid } from "material-ui";

import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import Field from "../../Field";

import { map } from "lodash";
const styles = theme => ({
  root: {},
  container: {
    alignItems: "flex-start"
  },
  tabs: {
    width: `calc(100% + ${theme.spacing.unit * 6}px)`,
    margin: `0 -${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  }
});

class Card extends React.Component {
  state = {
    openedSection: "main",
    currentEdit: ""
  };
  handleChangeTab = (event, value) => {
    this.setState({ openedSection: value });
  };
  render() {
    const { fieldsSections, classes } = this.props;
    const { openedSection, currentEdit } = this.state;

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
              return <Tab label={section.name} value={code} key={code} />;
            })}
          </Tabs>
        </AppBar>
        <div>
          <Grid container className={classes.container}>
            {map(fieldsSections[openedSection].fields, (val, id) => (
              <Field id={id} key={id} edit={currentEdit === id} />
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

Card.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(connect(mapStateToProps)(Card));
