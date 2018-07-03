import React from "react";
import { connect } from "react-redux";

import { size, map } from "lodash";

import List, { ListItem, ListItemText } from "material-ui/List";
import Radio from "material-ui/Radio";

import { closeSearch, saveSelectedValue } from "../../../actions/form";
import { entitySearch } from "../Street";

class SearchResult extends React.PureComponent {
  state = {
    value: this.props.value
  };

  handleToggle = value => e => {
    this.handleChangeValue(value);
  };

  handleChange = e => {
    const { value } = e.target;
    this.handleChangeValue(value);
  };

  handleChangeValue = id => {
    const { id: name } = this.props.field;
    const arValue = this.props.result[id];
    const { value } = arValue;

    this.setState({ value });
    this.props.closeSearch();
    this.props.saveSelectedValue(arValue);
    const { onChange } = this.props;
    if (onChange) {
      onChange({ value, name });
    }
  };

  render() {
    const { result, field } = this.props;
    return (
      size(result) > 0 && (
        <List>
          {map(result, (arItem, id) => {
            return (
              <ListItem key={id} dense button onClick={this.handleToggle(id)}>
                <Radio
                  checked={this.state.value === arItem.value}
                  onChange={this.handleChange}
                  value={id}
                  name={field.id}
                  disableRipple
                />
                <ListItemText
                  primary={arItem.value}
                  secondary={arItem.parent ? arItem.parent : ""}
                />
              </ListItem>
            );
          })}
        </List>
      )
    );
  }
}
const mapStateToProps = state => {
  const { result } = state.crm.form.search[entitySearch];

  return { result };
};
const mapDispatchToProps = dispatch => {
  return {
    closeSearch: () => {
      dispatch(closeSearch({ entitySearch }));
    },
    saveSelectedValue: value => {
      dispatch(saveSelectedValue({ entitySearch, value }));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResult);
