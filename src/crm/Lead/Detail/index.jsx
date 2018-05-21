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
import { Hidden } from "material-ui";

import { get, size } from "lodash";

import { fetchDetail, onInitDetail } from "../../actions/crm";
import { entities } from "../../../constants";

const entityId = entities.lead;

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

class LeadDetail extends React.Component {
  constructor(props) {
    super(props);
    props.onInit();
  }
  state = {
    open: true
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.history.push("/crm/lead");
  };
  handleClickSave = () => {
    this.props.onSave();
    this.handleClose();
  };

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
            <Typography type="title" color="inherit" className={classes.flex}>
              Покупатель
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Card match={this.props.match} />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { elementId } = ownProps.match.params;
  const { values } = state.crm[entityId];
  return { elementId, values };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { elementId, values } = stateProps;
  const { dispatch } = dispatchProps;
  const objectValues = get(values, elementId, null);

  if (objectValues == null || size(objectValues) === 0) {
    dispatch(fetchDetail({ entityId, elementId }));
  }
  return {
    ...stateProps,
    ...ownProps,
    onSave: () => {
      // dispatch(addToWish({ objectsId: [params.id], wishId: 0 }));
    },
    onInit: () => {
      dispatch(onInitDetail({ entityId, elementId }));
    }
  };
};

LeadDetail.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(mapStateToProps, null, mergeProps)(withMobileDialog()(LeadDetail))
);
