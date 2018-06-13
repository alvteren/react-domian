import React, { Fragment } from "react";
import { Toolbar, Hidden, AppBar, Button, Typography, IconButton } from "material-ui";
import { Dialog, DialogContent } from "material-ui";
import CloseIcon from "material-ui-icons/Close";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import Slide from "material-ui/transitions/Slide";
import Card from "./Card";

import { withStyles } from "material-ui/styles";
import styles from "./Show.module.css";

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

class ShowDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      save: false,
      showSaveBtn: false
    };
  }

  render() {
    const { classes, open, fullScreen, handleClose, showId } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleClose}
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
              {this.props.reminderId === 0
                ? "Новый показ"
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
            showId={showId}
          />
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(MuiStyles)(ShowDialog);
