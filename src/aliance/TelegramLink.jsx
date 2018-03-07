import React from "react";
import { connect } from "react-redux";
import { fetchUserTelegram } from "./actions/telegram";

const TelegramLink = props => {
  return <div />;
};
const mapStateToProps = (state, ownProps) => {
  // const { link } = ownProps.match.params;
  const { telegram } = state;

  return {
    telegram
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const { link } = ownProps.match.params;
  return {
    onInit: () => {
      dispatch(fetchUserTelegram(link));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TelegramLink);
