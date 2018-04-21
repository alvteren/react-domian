import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { size } from "lodash";

import Slide from "material-ui/transitions/Slide";
import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import { Hidden } from "material-ui";

import styles from "./DistrictSelect.module.css";

import DistrictTree from "./DistrictTree";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const DistrictSelect = props => {
  const onChangeValue = values => {};

  const { fullScreen, values, onCloseDialog, onChange } = props;
  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={onCloseDialog}
      transition={Transition}
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
          <div>Выберите районы</div>
        </Toolbar>
      </AppBar>
      <DialogContent className={styles.dialogContent}>
        <DistrictTree {...props} />
      </DialogContent>
    </Dialog>
  );
};

DistrictSelect.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withMobileDialog()(DistrictSelect);
