import React, { Fragment } from "react";
import { connect } from "react-redux";

import List, { ListItem, ListItemText } from "material-ui/List";
import { Checkbox } from "material-ui";
import Collapse from "material-ui/transitions/Collapse";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import { typeRealtyConverter } from "./TypeRealtyConverter";
import { cloneDeep } from "lodash";
import { SECTION, TYPE_REALTY } from "./TypeRealtyConverter";

import styles from "./EditInput.module.css";
import { ENTITIES } from "../../../constants";
const entityId = ENTITIES.lead;

class EditInput extends React.PureComponent {
  state = {
    typeRealty: typeRealtyConverter(this.props.lead, this.props.fields)
  };
  toggleCollapse = id => () => {
    const isOpened = this.state[id];
    this.setState({ [id]: !isOpened });
  };
  onChangeValue = (type, sectionIndex, typeRealtyIndex) => e => {
    e.stopPropagation();
    const updated = cloneDeep(this.state.typeRealty);
    let target;
    switch (type) {
      case SECTION:
        target = updated[sectionIndex];
        target.checked
          ? (target.checked = !target.checked)
          : (target.checked = true);
        target.children.forEach((child, index) => {
          child.checked = target.checked;
        });
        if (target.checked) {
          target.checkedLength = target.children.length;
        } else {
          target.checkedLength = 0;
        }
        this.setState({ typeRealty: updated });
        break;
      case TYPE_REALTY:
        target = updated[sectionIndex].children[typeRealtyIndex];
        target.checked
          ? (target.checked = !target.checked)
          : (target.checked = true);
        if (target.checked) {
          ++updated[sectionIndex].checkedLength;
        } else {
          --updated[sectionIndex].checkedLength;
        }
        this.setState({ typeRealty: updated });
        break;
      default:
        break;
    }
    this.props.onTreeChange({
      name: type,
      value: target.value,
      add: target.checked
    });
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <List>
          {this.state.typeRealty.map((typeItem, index) => {
            if (!typeItem.children || !typeItem.children.length) {
              return (
                <ListItem
                  key={index}
                  button
                  onClick={this.onChangeValue(typeItem.value)}
                >
                  {/*<Checkbox checked={false} tabIndex={-1} disableRipple />*/}
                  <ListItemText inset primary={typeItem.label} />
                </ListItem>
              );
            } else {
              return (
                <Fragment key={index}>
                  <ListItem
                    button
                    onClick={this.toggleCollapse(typeItem.value)}
                  >
                    {/*<Checkbox*/}
                    {/*indeterminate={typeItem.checked || typeItem.checkedLength || false}*/}
                    {/*tabIndex={-1}*/}
                    {/*disableRipple*/}
                    {/*/>*/}
                    <ListItemText inset primary={typeItem.label} />
                    <div onClick={this.toggleCollapse(typeItem.value)}>
                      {this.state[typeItem.value] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </div>
                  </ListItem>
                  <Collapse
                    in={this.state[typeItem.value]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      component="div"
                      disablePadding
                      className={styles.nested}
                    >
                      {typeItem.children.map((realtyType, realtyTypeIndex) => {
                        return (
                          <ListItem
                            key={realtyTypeIndex}
                            button
                            onClick={this.onChangeValue(
                              TYPE_REALTY,
                              index,
                              realtyTypeIndex
                            )}
                          >
                            <Checkbox
                              checked={realtyType.checked || false}
                              tabIndex={-1}
                              disableRipple
                            />
                            <ListItemText inset primary={realtyType.label} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </Fragment>
              );
            }
          })}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { section, uf_crm_type_realty } = state.crm[entityId].fields;
  const fields = { section, uf_crm_type_realty };

  const { elementId } = ownProps;

  const lead = state.crm[entityId].values[elementId];

  return { fields, lead };
};

export default connect(mapStateToProps)(EditInput);
