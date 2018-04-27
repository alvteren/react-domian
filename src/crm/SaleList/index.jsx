import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchObjects, fetchObjectFields } from "../actions/objects";
import { fetchWish } from "../actions/wish";
import EnhancedTable from "../Table";
import Add from "./Add";
import Detail from "./Detail";
import Filter from "../Filter";
import GroupActions from "./GroupActions";
import Controls from "./Controls";

import { withStyles } from "material-ui/styles";
import { Button } from "material-ui";
import AddIcon from "material-ui-icons/Add";
import { Route } from "react-router-dom";
import MenuAdd from "../../Menu/Add";

import size from "lodash/size";

const styles = theme => ({
  buttonAdd: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});
class SaleList extends React.Component {
  constructor(props) {
    super(props);
    props.onInit();
  }
  state = {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const open = Boolean(this.state.anchorEl);

    return (
      <Fragment>
        <EnhancedTable
          id="objects"
          controls={["favorite"]}
          onChangePage={this.props.onChangePage}
          filterComponent={<Filter id="objects" />}
          groupActionsComponents={GroupActions}
          controlComponents={Controls}
        />
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={classes.buttonAdd}
          onClick={this.handleClick}
        >
          <AddIcon />
        </Button>
        <MenuAdd
          anchorEl={this.state.anchorEl}
          open={open}
          onClose={this.handleClose}
        />
        <Route path="/crm/sale/add" component={Add} />
        <Route path="/crm/sale/show/:id" component={Detail} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { filter, page, rowsPerPage, orderBy, order, data } = state.crm.objects;
  return {
    filter,
    page,
    rowsPerPage,
    orderBy,
    order,
    data
  };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { filter, page, rowsPerPage, orderBy, order, data } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...ownProps,
    ...stateProps,
    onInit: () => {
      dispatch(fetchObjectFields());
      dispatch(fetchObjects({ filter, page, rowsPerPage, orderBy, order }));
      dispatch(fetchWish({ entityId: "sale" }));
    },
    onChangePage: newPage => {
      if (rowsPerPage * newPage >= size(data))
        dispatch(
          fetchObjects({ filter, page: newPage, rowsPerPage, orderBy, order })
        );
    }
  };
};
export default connect(mapStateToProps, null, mergeProps)(
  withStyles(styles)(SaleList)
);
