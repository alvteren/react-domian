import React from "react";
import { connect } from "react-redux";

import { addToWish, removeFromWish } from "../../actions/wish";

import { Tooltip } from "material-ui";
import {
  StarBorder as StarBorderIcon,
  Star as StarIcon
} from "material-ui-icons";

import styles from "./AddToWish.module.css";

const AddToWish = props => {
  const onClick = event => {
    event.stopPropagation();
    if (isAdded) {
      props.removeFromWish();
    } else {
      props.addToWish();
    }
  };

  const { isAdded } = props;

  return (
    <Tooltip
      title={isAdded ? "Убрать из избранного" : "Добавить в избранное"}
      enterDelay={300}
    >
      <div onClick={onClick}>
        {isAdded ? (
          <StarIcon className={styles.wishIconActive} />
        ) : (
          <StarBorderIcon />
        )}
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { id, entityId } = ownProps;
  const { wish } = state.crm[entityId];
  return {
    isAdded: wish[id]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id, entityId } = ownProps;

  return {
    addToWish: () => {
      dispatch(addToWish({ elementsId: [id], entityId }));
    },
    removeFromWish: () => {
      dispatch(removeFromWish({ elementsId: [id], entityId }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToWish);
