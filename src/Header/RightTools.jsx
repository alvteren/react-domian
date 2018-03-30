import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import SaleRightTools from "../crm/SaleList/RightTools";

const RightTools = props => {
  return (
    <Fragment>
      <Route path="/crm/sale" component={SaleRightTools} />
    </Fragment>
  );
};

export default connect()(RightTools);
