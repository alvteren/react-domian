import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Form from "./Form";

import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import Button from "material-ui/Button";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import CloseIcon from "material-ui-icons/Close";
import Slide from "material-ui/transitions/Slide";

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

class Add extends React.Component {
  state = {
    open: true
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.history.push("/crm/sale");
  };
  handleClickSave = () => {
    this.props.onSave();
    this.handleClose();
  };

  render() {
    const { fullScreen, onClick, classes } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.state.open}
        onClose={this.handleClose}
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="contrast"
              onClick={this.handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Добавление объекта
            </Typography>
            <Button
              raised
              color="accent"
              onClick={this.handleClickSave}
              className={classes.buttonSave}
            >
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Form />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    onSave: () => {
      // dispatch(addToWish({ objectsId: [params.id], wishId: 0 }));
    }
  };
};

Add.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withMobileDialog()(Add))
);