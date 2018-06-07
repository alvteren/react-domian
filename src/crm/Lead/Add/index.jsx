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

    this.props.history.push("/crm/lead");
  };
  handleClickSave = () => {
    this.props.saveFormToServer();
  };

  componentDidMount() {
    if (!this.state.loading) {
      this.setInitFormData();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fields } = nextProps;
    if (JSON.stringify(this.props.fields) === JSON.stringify(fields)) return;
    this.setInitFormData();
    this.setState({ loading: false });
  }

  setInitFormData() {
    this.props.setInitFormState();
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
          <Form loadFields={this.state.loading} />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { fields, values } = state.crm[entityId];
  return { fields, values };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    getLeadFields() {
      dispatch(fetchFields({ entityId }));
    },
    setInitFormState() {
      dispatch(setInitFormState({ entityId }));
    },
    saveFormToServer() {
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
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Add)
  )
);
