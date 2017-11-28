import React from "react";
import { connect } from "react-redux";
import { addToWish } from "../actions/wish";

const mapStateToProps = (state, ownProps) => {
  return { isAdded: state.isAdded };
};
const mapDispatchToProps = (dispatch, props) => {
  const { params } = props.match;
  return {
    onClick: () => {
      dispatch(addToWish({ objectId: params.id, id: 0 }));
    }
  };
};

const Add = connect(mapStateToProps, mapDispatchToProps)(({ onClick }) => {
  return <button onClick={onClick}>123</button>;
});
export default Add;
