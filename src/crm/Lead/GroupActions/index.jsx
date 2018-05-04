import React, { Fragment } from "react";
import { connect } from "react-redux";

import { IconButton, Tooltip } from "material-ui";
import StarIcon from "material-ui-icons/Star";
import { addToWish } from "../../actions/wish";

const GroupActions = props => {
  const { addToWish } = props;
  return (
    <Fragment>
      <Tooltip title="Добавить в избранное">
        <IconButton aria-label="Favorite" onClick={addToWish}>
          <StarIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { entityId } = ownProps;
  const { selected } = state.crm[entityId];

  return {
    entityId,
    selected
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { entityId } = ownProps;
  const { selected } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...ownProps,
    ...stateProps,
    addToWish()  {
      dispatch(addToWish({ elementsId: selected, entityId }));
    }
  }

};

export default connect(mapStateToProps, null, mergeProps)(GroupActions);
