import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getCurrentUser } from "../actions/auth";
import AuthForm from "./AuthForm";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    const { isAuthorized, onInit } = props;
    if (isAuthorized === null) {
      onInit();
    }
  }

  render() {
    const props = this.props;
    return (
      <Fragment>
        {props.isAuthorized === true && <div>{props.children}</div>}
        {props.isAuthorized === false && <AuthForm />}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isAuthorized } = state.user.auth;
  return {
    isAuthorized
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onInit: () => {
      dispatch(getCurrentUser());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
