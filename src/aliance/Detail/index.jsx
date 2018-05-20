import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import { AppBar, Toolbar, IconButton, Typography, Grid, Avatar, Paper,  Badge, Tooltip, LinearProgress } from 'material-ui';

import CloseIcon from "material-ui-icons/Close";
import Slide from "material-ui/transitions/Slide";

import styles from "./Detail.module.css";

import { getMembers } from "../actions/aliance";
import constants from "../../constants";
import { map } from "lodash";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class Detail extends React.Component {
  constructor(props) {
    super(props);
    const { members_count } = props.alliance;
    members_count > 0 && props.onInit();
  }
  handleClose = () => {
    this.props.history.push("/alliance");
  };

  render() {
    const { fullScreen, alliance, status } = this.props;
    const { members_count, members } = alliance;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={true}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={styles.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={styles.flex}>
              Альянс "{alliance.name}"
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={styles.progressWrapper}>
          {status === "loading" && (
            <LinearProgress variant="query" thickness={1} />
          )}
        </div>
        <DialogContent className={styles.dialogContent}>
          <Grid container>
            {members_count > 0 ? (
              map(members, (user, id) => {
                return (
                  <Grid item xs={12} sm={6} key={id}>
                    <Paper className={styles.userCard}>
                      {user.avatar ? (
                        <Avatar src={constants.imgBaseUrl + user.avatar} />
                      ) : (
                        <Avatar>{user.initial}</Avatar>
                      )}
                      <div className={styles.username}>{user.name}</div>
                      <Tooltip title="Задатки">
                        <div className={styles.depositBadgeWrapper}>
                          <Badge color="primary" badgeContent={user.deposit || 0}>
                            {/*Badge component required a child element*/}
                            <div></div>
                          </Badge>
                        </div>
                      </Tooltip>
                    </Paper>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                В альянсе никого нет
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { data } = state.aliance.aliances;
  const { status } = state.aliance;
  const id = ownProps.match.params.id;
  const key = "aliance" + id;

  return {
    alliance: data[key],
    status,
    id
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;

  return {
    ...ownProps,
    ...stateProps,
    onInit: () => {
      dispatch(getMembers({ id: stateProps.id }));
    }
  };
};
Detail.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withMobileDialog()(
  connect(mapStateToProps, null, mergeProps)(Detail)
);
