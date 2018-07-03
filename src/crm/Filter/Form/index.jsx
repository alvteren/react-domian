import React from "react";

import Slide from "material-ui/transitions/Slide";
import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import { Hidden } from "material-ui";
import { LinearProgress } from "material-ui";
import FilterForm from "./FilterForm";
import { connect } from "react-redux";
import { filterToggle, applyFilter } from "../../actions/filter";
import ButtonSave from "../../../UI/Modal/ButtonSave/index";

import styles from "./Form.module.css";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class Form extends React.PureComponent {
  render() {
    const { fullScreen, closeFilter, loading, open } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={closeFilter}
        TransitionComponent={Transition}
      >
        <AppBar color="inherit" className={styles.appBar}>
          <Toolbar>
            <IconButton
              color="primary"
              onClick={closeFilter}
              aria-label="Close"
            >
              <Hidden mdUp>
                <ArrowBackIcon />
              </Hidden>
              <Hidden smDown>
                <CloseIcon />
              </Hidden>
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={styles.progressWrapper}>
          {loading && <LinearProgress variant="query" thickness={1} />}
        </div>
        <DialogContent>
          <FilterForm {...this.props} />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entityId } = ownProps;
  const entityStore = state.crm[entityId];
  const { filter } = entityStore;
  const { open } = filter;

  return { open };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { entityId } = ownProps;
  return {
    closeFilter: () => {
      dispatch(filterToggle({ entityId, open: false }));
    },
    applyForm: () => {
      dispatch(applyFilter({ entityId }));
      dispatch(filterToggle({ entityId, open: false }));
    }
  };
};

export default withMobileDialog()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
);
