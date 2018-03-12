import React from "react";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import { Toolbar, Typography, IconButton, Tooltip } from "material-ui";
import DeleteIcon from "material-ui-icons/Delete";
import { connect } from "react-redux";

const toolbarStyles = theme => ({
  root: {
    display: "block"
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

  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "space-between"
  }
});

const EnhancedToolbar = props => {
  const { numSelected, classes, onDeleteSelectedData, filterComponent } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <div className={classes.title}>
          <Typography type="subheading">{numSelected} выбрано</Typography>
          <Tooltip className={classes.actions} title="Удалить">
            <IconButton aria-label="Delete" onClick={onDeleteSelectedData}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div>{filterComponent}</div>
      )}
    </Toolbar>
  );
};
const mapStateToProps = (state, ownProps) => {
  const { tooltipTitle } = state.crm[ownProps.id];
  return { tooltipTitle };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(toolbarStyles)(EnhancedToolbar)
);