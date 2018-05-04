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
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import Typography from "material-ui/Typography";
import CloseIcon from "material-ui-icons/Close";
import Slide from "material-ui/transitions/Slide";
import { Hidden } from "material-ui";
import {saveToStore, setInitFormState} from "../../actions/form";
import { fetchLeadFields } from "../../actions/lead";

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
    open: true,
    loading: true
  };

  handleClose = () => {
    this.setState({ open: false });

    this.props.history.push("/crm/sale");
  };
  handleClickSave = () => {
    this.props.onSave();
    this.handleClose();
  };

  componentWillReceiveProps(nextProps) {
    const { fields } = nextProps;
    if (!fields || !Object.keys(fields).length) return;
    this.setState({ loading: false });
    const initState = {};
    Object.keys(fields).forEach(key => {
      initState[key] = fields[key].default || "";
    });
    initState.can = { edit: true };
    this.props.setInitFormState(initState);
  }

  render() {
    const { fullScreen, classes } = this.props;
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
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Добавление Покупателя
            </Typography>
            <Button
              variant="raised"
              color="secondary"
              onClick={this.handleClickSave}
              className={classes.buttonSave}
            >
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Form loadFields={this.state.loading} />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const entityId = "leads";
  const { fields } = state.crm[entityId];
  return { fields, entityId };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,
    onSave: () => {
      // dispatch(addToWish({ objectsId: [params.id], wishId: 0 }));
    }
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  console.log(stateProps);
  const { fields, entityId } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...stateProps,
    ...ownProps,
    getLeadFields() {
      dispatch(fetchLeadFields());
    },
    setInitFormState(initState) {
      dispatch(setInitFormState({ initState, id: entityId }))
    },
  }
};

Add.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Add))
);
