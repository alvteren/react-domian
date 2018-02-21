import React, { Fragment } from "react";
import { connect } from "react-redux";

import Avatar from "material-ui/Avatar";
import constants from "../../constants";

import styles from "./UserCard.module.css";

const UserCard = props => {
  const { user } = props;
  return (
    <div className={styles.flex}>
      {user && (
        <Fragment>
          {user.avatar ? (
            <Avatar src={constants.imgBaseUrl + user.avatar} />
          ) : (
            <Avatar>{user.initial}</Avatar>
          )}

          <div className={styles.username}>{user.name}</div>
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const { user } = state.user;

  return { user };
};
export default connect(mapStateToProps)(UserCard);
