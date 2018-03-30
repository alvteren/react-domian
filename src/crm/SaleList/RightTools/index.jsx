import React from "react";
import { connect } from "react-redux";
import { size, map } from "lodash";
import SearchIcon from "material-ui-icons/Search";
import FilterListIcon from "material-ui-icons/FilterList";
import { Hidden, IconButton, Tooltip } from "material-ui";

import styles from "./index.module.css";

import { activeTool } from "../../actions/rightTools";

class RightTools extends React.Component {
  state = {
    open: false
  };
  render() {
    const { rightTools } = this.props;
    if (rightTools && size(rightTools) > 0) {
      return (
        <div className={styles.iconsWrapper}>
          <Hidden mdUp>
            {map(rightTools, arTool => {
              const Icon = () => {
                if (arTool.id === "search") {
                  return <SearchIcon />;
                }
                if (arTool.id === "filter") {
                  return <FilterListIcon />;
                }
                return "";
              };

              return (
                <Tooltip key={arTool.id} title={arTool.title}>
                  <IconButton
                    color="inherit"
                    onClick={this.props.toolAction(arTool.id)}
                  >
                    {Icon()}
                  </IconButton>
                </Tooltip>
              );
            })}
          </Hidden>
        </div>
      );
    } else {
      return <span />;
    }
  }
}

const mapToStateProps = state => {
  const { rightTools } = state.crm.objects;
  return { rightTools };
};

const mapToDispatchProps = dispatch => {
  return {
    toolAction: toolId => () => {
      dispatch(activeTool(toolId));
    }
  };
};

export default connect(mapToStateProps, mapToDispatchProps)(RightTools);
