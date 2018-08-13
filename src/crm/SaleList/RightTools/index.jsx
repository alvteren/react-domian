import React from "react";
import { connect } from "react-redux";
import { size, map } from "lodash";
import SearchIcon from "material-ui-icons/Search";
import FilterListIcon from "material-ui-icons/FilterList";
import { Hidden, IconButton, Tooltip } from "material-ui";

import styles from "./index.module.css";

import { activeTool } from "../../actions/rightTools";
import { ENTITIES, RIGHT_TOOLS } from "../../../constants";
const entityId = ENTITIES.sale;

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
                if (arTool.id === RIGHT_TOOLS.search) {
                  return <SearchIcon />;
                }
                if (arTool.id === RIGHT_TOOLS.filter) {
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
  const { rightTools } = state.crm[entityId];
  return { rightTools };
};

const mapToDispatchProps = dispatch => {
  return {
    toolAction: toolId => () => {
      dispatch(activeTool({ entityId, toolId }));
    }
  };
};

export default connect(
  mapToStateProps,
  mapToDispatchProps
)(RightTools);
