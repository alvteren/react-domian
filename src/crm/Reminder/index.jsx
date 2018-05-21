import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card from "./Card";

import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import CloseIcon from "material-ui-icons/Close";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import Slide from "material-ui/transitions/Slide";
import { Hidden } from "material-ui";

import { get, size } from "lodash";


const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  buttonSave: {
    marginLeft: theme.spacing.unit * 2
  },
  dialogContent: {}
});

class Reminder extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    open: true
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.history.push("/crm/lead");
  };

  render() {
    const { fullScreen, classes } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.state.open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleClose}
              aria-label="Close"
            >
              <Hidden mdUp>
                <ArrowBackIcon />
              </Hidden>
              <Hidden smDown>
                <CloseIcon />
              </Hidden>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Новое напоминание
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Card close={this.handleClose} match={this.props.match} />
        </DialogContent>
      </Dialog>
    );
  }
}

Reminder.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)((withMobileDialog()(Reminder))
);
