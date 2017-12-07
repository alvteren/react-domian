import React from "react";
import { connect } from "react-redux";
import { authorizeBy } from "../actions/auth";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    // if (!props.isAuthorized) {
    // props.authorize({login:"admin",password:"159753"});
    // props.authorizeBy(1);
    // }
  }

  render() {
    const props = this.props;
    return <div>{props.isAuthorized && <div>{props.children}</div>}</div>;
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
    authorizeBy: userId => {
      dispatch(authorizeBy(userId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
