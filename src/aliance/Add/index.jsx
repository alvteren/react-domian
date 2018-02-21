import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import Button from "material-ui/Button";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import CloseIcon from "material-ui-icons/Close";
import Slide from "material-ui/transitions/Slide";

import styles from "./Add.module.css";

import { createAliance } from "../actions/aliance";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const Add = props => {
  const { fullScreen } = props;

  const handleClose = () => {
    props.history.push("/alliance");
  };

  const handleClickSave = () => {
    const value = document.getElementById("name_aliance").value;
    props.onSave({ name: value });
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={handleClose}
      transition={Transition}
    >
      <AppBar className={styles.appBar}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={styles.flex}>
            Создать альянс
          </Typography>
          <Button
            variant="raised"
            color="secondary"
            onClick={handleClickSave}
            className={styles.buttonSave}
          >
            Сохранить
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent className={styles.dialogContent}>
        <TextField
          required
          id="name_aliance"
          label="Название альянса"
          margin="normal"
          autoFocus
        />
      </DialogContent>
    </Dialog>
  );
};
const mapStateToProps = (state, ownProps) => {
  const {
    filter,
    page,
    rowsPerPage,
    orderBy,
    order,
    data
  } = state.aliance.aliances;

  return {
    filter,
    page,
    rowsPerPage,
    orderBy,
    order,
    data
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    onSave: props => {
      const { name } = props;
      dispatch(createAliance({ name }));
    }
  };
};
Add.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withMobileDialog()(
  connect(mapStateToProps, mapDispatchToProps)(Add)
);
