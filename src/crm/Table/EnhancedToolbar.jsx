import React from "react";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import { Toolbar, Typography } from "material-ui";
import { connect } from "react-redux";

const toolbarStyles = theme => ({
  root: {
    display: "block"
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.dark,
          backgroundColor: theme.palette.secondary.light
        }
      : {
          color: theme.palette.secondary.light,
          backgroundColor: theme.palette.secondary.dark
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
  const {
    numSelected,
    classes,
    filterComponent,
    groupActionsComponent,
    id: entityId
  } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <div className={classes.title}>
          <Typography style={{ marginRight: "auto" }} type="subheading">
            {numSelected} выбрано
          </Typography>
          {React.createElement(groupActionsComponent, {
            entityId: entityId
          })}
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
