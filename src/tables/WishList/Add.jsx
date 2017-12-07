import React from "react";
import { connect } from "react-redux";
import { addToWish } from "../actions/wish";

import IconButton from "material-ui/IconButton";
import Tooltip from "material-ui/Tooltip";
import StarIcon from "material-ui-icons/Star";
import StarBorderIcon from "material-ui-icons/StarBorder";

const mapStateToProps = (state, ownProps) => {
  return { isAdded: state.isAdded };
};
const mapDispatchToProps = (dispatch, props) => {
  const { params } = props.match;
  return {
    onClick: () => {
      dispatch(addToWish({ objectsId: [params.id], wishId: 0 }));
    }
  };
};

const Add = connect(mapStateToProps, mapDispatchToProps)(props => {
  const { isAdded, onClick } = props;
  return (
    <Tooltip title="Добавить в список">
      <IconButton aria-label="Add" onClick={onClick}>
        {isAdded ? <StarIcon style={{ color: "#0f0" }} /> : <StarBorderIcon />}
      </IconButton>
    </Tooltip>
  );
});
export default Add;
