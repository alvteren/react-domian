import React, {Fragment} from "react";
import { connect } from "react-redux";

import List, { ListItem, ListItemText } from "material-ui/List";
import { Checkbox } from "material-ui";
import Collapse from "material-ui/transitions/Collapse";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import { districtTreeConverter } from "./districtTreeConverter";
import { cloneDeep } from "lodash";

import styles from "./DistrictTree.module.css";

class DistrictTree extends React.PureComponent {
  state = {
    districtTree: districtTreeConverter(this.props.lead, this.props.fields)
  };
  toggleCollapse = id => () => {
    const isOpened = this.state[id];
    this.setState({ [id]: !isOpened });
  };
  onChangeValue = (type, districtIndex, subDistrictIndex) => e => {
    e.stopPropagation();
    const updated = cloneDeep(this.state.districtTree);
    let target;
    switch (type) {
      case "uf_crm_district":
        target = updated[districtIndex];
        target.checked ? target.checked = !target.checked : target.checked = true;
        target.children.forEach((child, index) => {
          child.checked = target.checked;
        });
        if (target.checked) {
          target.checkedLength = target.children.length;
        } else {
          target.checkedLength = 0;
        }
        this.setState({districtTree: updated});
        break;
      case "uf_crm_subdistrict":
        target = updated[districtIndex].children[subDistrictIndex];
        target.checked ?
          target.checked =!target.checked :
          target.checked = true;
        if (target.checked) {
          ++updated[districtIndex].checkedLength;
        } else {
          --updated[districtIndex].checkedLength;
        }
        updated[districtIndex].checked = updated[districtIndex].checkedLength === updated[districtIndex].children.length;
        this.setState({ districtTree: updated });
        break;
      default: break;
    }
    this.props.onTreeChange({
      name: type,
      value: target.value,
      add: target.checked
    })
  };
  updateStore = () => {

  };

  render() {
    return (
      <div className={styles.wrapper}>
        <List>
          {
            this.state.districtTree.map((district, index) => {
              if (!district.children || !district.children.length) {
                return (
                  <ListItem key={index} button onClick={this.onChangeValue(district.value)}>
                    <Checkbox checked={false} tabIndex={-1} disableRipple />
                    <ListItemText inset primary={district.label} />
                  </ListItem>
                )
              } else {
                return (
                  <Fragment key={index}>
                    <ListItem button onClick={this.toggleCollapse(district.value)}>
                      <Checkbox
                        checked={district.checked || district.checkedLength === district.children.length || false}
                        indeterminate={Boolean(district.checkedLength) && district.checkedLength < district.children.length}
                        tabIndex={-1}
                        disableRipple
                        onClick={this.onChangeValue("uf_crm_district", index)}
                      />
                      <ListItemText inset primary={district.label} />
                      <div onClick={this.toggleCollapse(district.value)}>
                        {this.state[district.value] ? <ExpandLess /> : <ExpandMore />}
                      </div>
                    </ListItem>
                    <Collapse in={this.state[district.value]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding className={styles.nested}>
                      {district.children.map((subDistrict, subDistrictIndex) => {
                        return (
                          <ListItem key={subDistrictIndex} button onClick={this.onChangeValue("uf_crm_subdistrict",  index, subDistrictIndex)}>
                            <Checkbox checked={subDistrict.checked || false} tabIndex={-1} disableRipple />
                            <ListItemText inset primary={subDistrict.label} />
                          </ListItem>
                        )
                      })}
                      </List>
                    </Collapse>
                  </Fragment>
                )
              }
            })
          }
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    uf_crm_district,
    uf_crm_subdistrict
  } = state.crm.lead.fields;
  const fields = { uf_crm_district, uf_crm_subdistrict };

  const { objectId } = ownProps;

  const lead = state.crm.lead.values[objectId];

  return { fields, lead };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictTree);
