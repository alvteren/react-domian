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
import { setInitFormState } from "../../actions/form";
import { saveFormToServer, saveToStore, fetchFields } from "../../actions/crm";
import { formSubmit, validateFormError } from "../../actions/validate";
import { find } from "lodash";
import formValidate from "../../../util/formValidate";
import { ENTITIES } from "../../../constants";

const entityId = ENTITIES.lead;

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
    loading: !Object.keys(this.props.fields).length // UI blocked while fields is loading
  };

  handleClose = () => {
    this.setState({ open: false });

    this.props.history.push("/crm/sale");
  };
  handleClickSave = () => {
    this.props.saveFormToServer(this.props.values["0"]);
  };

  componentDidMount() {
    if (!this.state.loading) {
      this.setInitFormData(this.props.fields);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fields } = nextProps;
    if (JSON.stringify(this.props.fields) === JSON.stringify(fields)) return;
    this.setInitFormData(fields);
    this.setState({ loading: false });
  }

  setInitFormData(fields) {
    if (!fields || !Object.keys(fields).length) return;
    const initState = {};
    Object.keys(fields).forEach(key => {
      if (String(key) === "undefined") return;
      initState[key] = fields[key].hasOwnProperty("default")
        ? fields[key].default
        : "";
      if (key === "uf_crm_type_realty") initState[key] = [];
    });
    initState.can = { edit: true };
    this.props.setInitFormState(initState);
    return true;
  }

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
          <Form
            loadFields={this.state.loading}
            match={this.props.match}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;
  const { fields, values } = state.crm[entityId];
  return { fields, values, match };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,
    getLeadFields() {
      dispatch(fetchFields({ entityId }));
    }
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fields } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...stateProps,
    ...ownProps,
    setInitFormState(initState) {
      dispatch(setInitFormState({ initState, entityId }));
    },
    saveFormToServer(formData) {
      dispatch(saveFormToServer({ entityId, elementId: 0 }));
    }
  };
};

Add.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(Add)
  )
);
