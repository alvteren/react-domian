import React from "react";
import { connect } from "react-redux";

import { size, map } from "lodash";

import List, { ListItem, ListItemText } from "material-ui/List";
import Radio from "material-ui/Radio";

import { closeSearch } from "../../actions/form";
import { entitySearch } from "../Street";

class SearchResult extends React.Component {
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

  handleChangeValue = value => {
    this.setState({ value: value });
    this.props.closeLocationSearch();
    const { onChange, result } = this.props;
    const { name } = result[value];
    if (onChange) {
      onChange({ value, name });
    }
  };

  render() {
    const { result } = this.props;

    return (
      size(result) > 0 && (
        <List>
          {map(result, arLocation => {
            return (
              <ListItem
                key={arLocation.id}
                role={undefined}
                dense
                button
                onClick={this.handleToggle(arLocation.id)}
              >
                <Radio
                  checked={this.state.value === arLocation.id}
                  onChange={this.handleChange}
                  value={arLocation.id}
                  name="location"
                  disableRipple
                />
                <ListItemText
                  primary={arLocation.name}
                  secondary={arLocation.parent_name}
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
    closeLocationSearch: () => {
      dispatch(closeSearch({ entitySearch }));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
