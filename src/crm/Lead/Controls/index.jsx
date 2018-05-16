import React, { Fragment } from "react";
import AddToWish from "../../Controls/RowAction/AddToWish";

const Controls = props => {
  return (
    <Fragment>
      <AddToWish {...props} />
    </Fragment>
  );
};

export default Controls;
