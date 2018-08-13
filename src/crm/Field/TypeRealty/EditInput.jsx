import React, { Fragment } from "react";
import { connect } from "react-redux";

import List, { ListItem, ListItemText } from "material-ui/List";
import { Checkbox, RadioGroup, Radio, FormControlLabel } from "material-ui";
import Collapse from "material-ui/transitions/Collapse";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import { typeRealtyConverter } from "./TypeRealtyConverter";
import { cloneDeep, get } from "lodash";
import { SECTION, TYPE_REALTY } from "./TypeRealtyConverter";

import styles from "./EditInput.module.css";
import { ENTITIES } from "../../../constants";
const leadEntity = ENTITIES.lead;

function getChecked(element, index, array) {
  let arr = element.children.filter(item => item.checked);
  if (arr.length) return arr[0]
}

class EditInput extends React.PureComponent {
  constructor(props) {
    super(props);
    const typeRealty = typeRealtyConverter(this.props[this.props.entityId], this.props.fields);
    const checked = typeRealty.find(getChecked);

    this.state = {
      mode: this.props.entityId,
      typeRealty,
      checked: checked ? checked.value : ""
    };
  }

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

  onRadioChange = (realtyType) => e => {
    e.stopPropagation();
    this.setState({ checked: realtyType.value });
    this.props.onTreeChange({
      name: TYPE_REALTY,
      value: realtyType.value,
      add: true
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
                      {
                        !this.props.multipleSelect &&
                        typeItem.children.map((realtyType, realtyTypeIndex) => {
                          return (
                            <ListItem
                              key={realtyTypeIndex}
                              button
                              onClick={this.onRadioChange(realtyType)}
                            >
                              <Radio
                                checked={this.state.checked === realtyType.value}
                                color="primary"
                                value={realtyType.value}
                                name="realty-type"
                                aria-label={realtyType.value}
                              />
                              <ListItemText inset primary={realtyType.label} />
                            </ListItem>
                          );
                        })
                      }
                      {
                        this.props.multipleSelect &&
                        typeItem.children.map((realtyType, realtyTypeIndex) => {
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
  const { entityId, elementId } = ownProps;

  if (entityId && entityId === ENTITIES.show) {
    const { section, uf_crm_type_realty } = state.crm[entityId].fields;
    const show = state.crm[entityId].values[elementId];
    const fields = { section, uf_crm_type_realty };
    return { fields, show, entityId };
  } else {
    const { section, uf_crm_type_realty } = state.crm[leadEntity].fields;
    const lead = state.crm[leadEntity].values[elementId];
    const fields = { section, uf_crm_type_realty };
    return { fields, lead, entityId: leadEntity };
  }
};

export default connect(mapStateToProps)(EditInput);
