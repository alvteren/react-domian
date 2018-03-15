import React from "react";
import PropTypes from "prop-types";
import Swipeable from "react-swipeable";

import { omit } from "lodash";

const TabContainer = props => {
  return (
    <Swipeable
      onSwipedLeft={props.onSwipedLeft}
      onSwipedRight={props.onSwipedRight}
      {...omit(props, "children")}
    >
      {props.children}
    </Swipeable>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default TabContainer;
