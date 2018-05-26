import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import { Grid } from "material-ui";

import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";

import Field from "../../Field";
import TabContainer from "../../../app/TabContainer";

import { map, get, reduce, findIndex } from "lodash";
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

  getKeyCurrentTab = () => {
    const viewingTabs = this.getViewingTabs();
    const { openedSection } = this.state;
    return findIndex(viewingTabs, { value: openedSection });
  };

  getViewingTabs = () => {
    const { fieldsSections, canViewContacts } = this.props;
    return reduce(
      fieldsSections,
      (result, value, key) => {
        if (canViewContacts || key !== "contact") {
          return [...result, { label: value.name, value: key }];
        }
        return result;
      },
      []
    );
  };

  render() {
    const { fieldsSections, classes } = this.props;
    const { openedSection, currentEdit } = this.state;
    const viewingTabs = this.getViewingTabs();

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
            {map(viewingTabs, tab => {
              return (
                <Tab label={tab.label} value={tab.value} key={tab.value} />
              );
            })}
          </Tabs>
        </AppBar>
        <TabContainer onSwipedLeft={this.nexTab} onSwipedRight={this.prevTab}>
          <Grid container spacing={24} className={classes.container}>
            {map(fieldsSections[openedSection].fields, (val, id) => (
              <Field
                id={id}
                key={id}
                edit={currentEdit === id}
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
  const { fieldsSections } = state.crm[entityId];
  const { elementId } = ownProps.match.params;
  const values = get(state.crm[entityId].values, elementId, null);
  const can = get(values, "can", null);
  const canViewContacts = get(can, "view_contacts", false);
  return { fieldsSections, canViewContacts, values };
};

Card.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(connect(mapStateToProps)(Card));
