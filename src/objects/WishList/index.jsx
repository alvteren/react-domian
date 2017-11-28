import React from "react";
import { connect } from "react-redux";
import fetchObjects from "../actions/objects";

const mapStateToProps = state => {
  return { objects: state.objects };
};
const mapDispatchToProps = dispatch => {
  return {
    onClick: () => {
      dispatch(fetchObjects({ filter: { id: 1 }, offset: [0, 10] }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(({ onClick }) => {
  return <button onClick={onClick}>123</button>;
});
