import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchList, fetchFields } from "../actions/crm";
import EnhancedTable from "../Table";
import Add from "./Add";
import Detail from "./Detail";
import Filter from "../Filter";
import Reminder from "../Reminder"
import GroupActions from "../SaleList/GroupActions";
import Controls from "../SaleList/Controls";

import { withStyles } from "material-ui/styles";
import { Button } from "material-ui";
import AddIcon from "material-ui-icons/Add";
import { Route } from "react-router-dom";
import MenuAdd from "../../Menu/Add";

import size from "lodash/size";

import { ENTITIES } from "../../constants";

const entityId = ENTITIES.lead;

const styles = theme => ({
  buttonAdd: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});
class Lead extends React.Component {
  constructor(props) {
    super(props);
    props.onInit();
  }
  state = {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
    document.addEventListener("click", this.handleClose, false);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    document.removeEventListener("click", this.handleClose, false);
  };

  render() {
    const { classes } = this.props;
    const open = Boolean(this.state.anchorEl);
    return (
      <Fragment>
        <EnhancedTable
          entityId={entityId}
          onChangePage={this.props.onChangePage}
          onChangeRowsPerPage={this.props.onChangeRowsPerPage}
          filterComponent={<Filter entityId={entityId} />}
          groupActionsComponent={GroupActions}
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
        <Route path={`/crm/${entityId}/add`} component={Add} />
        <Route path={`/crm/${entityId}/show/:elementId`} component={Detail} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { filter, page, rowsPerPage, orderBy, order, data } = state.crm[
    entityId
  ];
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
      dispatch(fetchFields({ entityId }));
      dispatch(
        fetchList({ entityId, filter, page, rowsPerPage, orderBy, order })
      );
    },
    onChangePage: newPage => {
      if (rowsPerPage * newPage >= size(data))
        dispatch(
          fetchList({
            entityId,
            filter,
            page: newPage,
            rowsPerPage,
            orderBy,
            order
          })
        );
    },
    onChangeRowsPerPage(val) {
      if (val * page >= size(data) || (page === 0 && val >= size(data)))
        dispatch(
          fetchList({
            entityId,
            filter,
            page,
            rowsPerPage: val,
            orderBy,
            order
          })
        );
    }
  };
};
export default connect(mapStateToProps, null, mergeProps)(
  withStyles(styles)(Lead)
);
