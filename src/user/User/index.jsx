import React, { Fragment } from "react";
import { connect } from "react-redux";

const User = props => {
  return <Fragment />;
};

const mapDispatchToProps = dispatch => {
  return {
    onInit: () => {
      dispatch(fetchUser());
    }
  };
};

export default connect(null, mapDispatchToProps)(User);
