import React from "react";
import { connect } from "react-redux";

import List, { ListItem, ListItemText } from "material-ui/List";
import { Checkbox, Collapse } from "material-ui";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";

import styles from "./DistrictTree.module.css";

class DistrictTree extends React.PureComponent {
  state = {};
  toggleCollapse = id => () => {
    const isOpened = this.state[id];
    this.setState({ [id]: !isOpened });
  };
  onChangeValue = value => e => {
    e.stopPropagation();
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <List>
          <ListItem button onClick={this.onChangeValue("value1")}>
            <Checkbox checked={false} tabIndex={-1} disableRipple />
            <ListItemText inset primary="Район 1" />
          </ListItem>

          <ListItem button onClick={this.toggleCollapse("district123")}>
            <Checkbox
              checked={false}
              indeterminate
              tabIndex={-1}
              disableRipple
              onClick={this.onChangeValue("value1")}
            />
            <ListItemText inset primary="Район 2" />
            {/* this `district${value}` */}
            <div onClick={this.toggleCollapse("district123")}>
              {this.state["district123"] ? <ExpandLess /> : <ExpandMore />}
            </div>
          </ListItem>
          <Collapse in={this.state["district123"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className={styles.nested}>
              <ListItem button onClick={this.onChangeValue("value3")}>
                <Checkbox checked={true} tabIndex={-1} disableRipple />
                <ListItemText inset primary="Под район 1" />
              </ListItem>
              <ListItem button onClick={this.onChangeValue("value3")}>
                <Checkbox checked={false} tabIndex={-1} disableRipple />
                <ListItemText inset primary="Под район 2" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    uf_crm_district: districts,
    uf_crm_subdistrict: subdistricts
  } = state.crm.leads.fields;
  const fields = { districts, subdistricts };

  const { objectId } = ownProps;

  const lead = state.crm.leads.values[objectId];

  return { fields, lead };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictTree);
