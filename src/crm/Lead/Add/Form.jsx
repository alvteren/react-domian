import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { map, get, isEqual } from "lodash";

import Field from "../../Field";
import TabContainer from "../../../app/TabContainer";

import { withStyles } from "material-ui/styles";
import { Grid } from "material-ui";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import { ENTITIES } from "../../../constants";

const entityId = ENTITIES.lead;

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
  },
  textColorPrimary: {
    color: "#f44336"
  }
});

class Form extends React.Component {
  constructor(props) {
    super(props);
    const { fieldsSections } = props;

    this.state = {
      openedSection: "main",
      errorSections: {}
    };
  }

  componentDidUpdate(prevProps) {
    const { fieldsSections, validateErrors, close, submit } = this.props;
    let errorSections, openedSection;

    /* Control for toggle active tab to tab with error inputs */
    if (validateErrors) {
      errorSections = Object.keys(fieldsSections).reduce((accumulator, key, index, array) => {
        const valid = Object.keys(validateErrors).every((error) => !fieldsSections[key].fields.hasOwnProperty(error));
        if (!valid) accumulator[key] = true;
        return accumulator;
      }, {});
      if (Object.keys(errorSections).length) openedSection = Object.keys(errorSections)[0];
      if (!isEqual(this.state.errorSections, errorSections)) this.setState({ openedSection, errorSections });
    }
    /* Close dialog after submit */
    if (submit) {
      close();
    }
  }

  handleChangeTab = (event, value) => {
    this.setState({ openedSection: value });
  };

  checkExcludeNodes = node => {
    const checkHorizontalScroll = node => {
      return (
        node.hasAttribute("data-exclude-swipe") &&
        node.getAttribute("data-exclude-swipe")
      );
    };
    if (checkHorizontalScroll(node)) {
      return true;
    }
    let parent = node;
    while ((parent = parent.parentElement) != null) {
      if (checkHorizontalScroll(parent)) {
        return true;
      }
    }

    return false;
  };
  prevTab = event => {
    if (!this.checkExcludeNodes(event.target)) {
      const key = this.getKeyCurrentTab();
      if (key > 0) {
        const viewingTabs = this.getViewingTabs();
        const newTab = viewingTabs[key - 1];
        this.setState({ openedSection: newTab.value });
      }
    }
  };

  nexTab = event => {
    if (!this.checkExcludeNodes(event.target)) {
      const key = this.getKeyCurrentTab();
      const viewingTabs = this.getViewingTabs();
      if (key + 1 < viewingTabs.length) {
        const newTab = viewingTabs[key + 1];
        this.setState({ openedSection: newTab.value });
      }
    }
  };

  render() {
    const { fieldsSections, classes } = this.props;
    const { openedSection, errorSections } = this.state;

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
              <Tab
                disabled={this.props.loadFields}
                label={section.name}
                value={code}
                key={code}
                className={errorSections.hasOwnProperty(code) ? this.props.classes.textColorPrimary : ""}
              />
            ))}
          </Tabs>
        </AppBar>
        <TabContainer onSwipedLeft={this.nexTab} onSwipedRight={this.prevTab}>
          <Grid container spacing={24} className={classes.container}>
            {map(fieldsSections[openedSection].fields, (val, id) => (
              <Field
                id={id}
                key={id}
                edit={true}
                elementId={get(this.props, "match.params.elementId", 0)}
                entityId={entityId}
              />
            ))}
          </Grid>
        </TabContainer>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { loadFields, match, close } = ownProps;
  const { fieldsSections } = state.crm[entityId];
  let validateErrors = get(state, `crm.${entityId}.validity[0].validateErrors`, null);
  let submit = get(state, `crm.${entityId}.validity[0].submit`, null);

  return { fieldsSections, loadFields, validateErrors, match, submit, close };
};

Form.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(connect(mapStateToProps)(Form));
