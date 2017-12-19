import React from "react";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import { Toolbar, Typography, IconButton, Tooltip, Grid } from "material-ui";
import DeleteIcon from "material-ui-icons/Delete";
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

  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    display: "flex",
    alignItems: "center",
    height: "100%"
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
      <Grid container spacer={8}>
        <Grid item xs={10} md={11}>
          <div className={classes.title}>
            {numSelected > 0 ? (
              <Typography type="subheading">{numSelected} выбрано</Typography>
            ) : (
              <Typography type="title">{filterComponent}</Typography>
            )}
          </div>
        </Grid>
        <Grid item xs={2} md={1}>
          <div className={classes.actions}>
            {numSelected > 0 && (
              <Tooltip title="Удалить">
                <IconButton aria-label="Delete" onClick={onDeleteSelectedData}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Grid>
      </Grid>
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
