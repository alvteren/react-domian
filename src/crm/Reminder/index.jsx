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
import Button from  "material-ui/Button";
import { Hidden } from "material-ui";

import { get, size } from "lodash";
import styles from "./index.module.css";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const MuiStyles = theme => ({
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
    this.state = {
      open: true,
      save: false,
      showSaveBtn: false
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    this.props.history.push("/crm/lead");
  };

  handleClickSave = () => {
    this.setState({ save: true });
  };

  showSaveBtn = (bool) => {
    this.setState({ showSaveBtn: bool });
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
              {this.props.match.params.reminderId === "add"
                ? "Новое напоминание"
                : "Редактирование"}
            </Typography>
              <Button
                variant="raised"
                color="secondary"
                onClick={this.handleClickSave}
                className={this.state.showSaveBtn ? styles.saveBtnVisible : styles.saveBtnHidden}
              >
                Сохранить
              </Button>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Card
            save={this.state.save}
            showSaveBtn={this.showSaveBtn}
            close={this.handleClose}
            match={this.props.match}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

Reminder.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(MuiStyles)(withMobileDialog()(Reminder));
