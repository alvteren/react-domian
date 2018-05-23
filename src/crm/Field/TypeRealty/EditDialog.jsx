import React from "react";
import PropTypes from "prop-types";

import Slide from "material-ui/transitions/Slide";
import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from "material-ui-icons"
import { Hidden } from "material-ui";

import styles from "./EditDialog.module.css";

import EditInput from "./EditInput";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const TypeRealtySelect = props => {

  const { fullScreen, onCloseDialog, isTreeChanged, onSaveToStore } = props;
  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={onCloseDialog}
      TransitionComponent={Transition}
    >
      <AppBar color="inherit" className={styles.appBar}>
        <Toolbar>
          <IconButton
            color="primary"
            onClick={onCloseDialog}
            aria-label="Close"
          >
            <Hidden mdUp>
              <ArrowBackIcon />
            </Hidden>
            <Hidden smDown>
              <CloseIcon />
            </Hidden>
          </IconButton>
          <div>Выберите тип недвижимости</div>
          {isTreeChanged &&
            <Button
              className={styles.saveBtn}
              onClick={onSaveToStore}
              color="primary"
              variant="raised"
              size="small">
              Сохранить
              <SaveIcon />
            </Button>
          }
        </Toolbar>
      </AppBar>
      <DialogContent className={styles.dialogContent}>
        <EditInput {...props} />
      </DialogContent>
    </Dialog>
  );
};

TypeRealtySelect.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withMobileDialog()(TypeRealtySelect);
