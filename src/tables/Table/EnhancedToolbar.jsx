import React from "react";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Tooltip from "material-ui/Tooltip";
import DeleteIcon from "material-ui-icons/Delete";
import FilterListIcon from "material-ui-icons/FilterList";
import { connect } from "react-redux";

const toolbarStyles = theme => ({
  root: {
    paddingRight: 2
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.A700,
          backgroundColor: theme.palette.secondary.A100
        }
      : {
          color: theme.palette.secondary.A100,
          backgroundColor: theme.palette.secondary.A700
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

const EnhancedToolbar = props => {
  const { numSelected, classes, tooltipTitle, onDeleteSelectedData } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography type="subheading">{numSelected} выбрано</Typography>
        ) : (
          <Typography type="title">{tooltipTitle}</Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Удалить">
            <IconButton aria-label="Delete" onClick={onDeleteSelectedData}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Фильтр">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};
const mapStateToProps = (state, ownProps) => {
  const { tooltipTitle } = state.tables.data[ownProps.id];
  return { tooltipTitle };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(toolbarStyles)(EnhancedToolbar)
);
