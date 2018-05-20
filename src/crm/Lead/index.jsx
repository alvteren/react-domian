import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchLeads, fetchLeadFields } from "../actions/lead";
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
          id="lead"
          onChangePage={this.props.onChangePage}
          filterComponent={<Filter id="lead" />}
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
        <Route path="/crm/lead/add" component={Add} />
        <Route path="/crm/lead/show/:id" component={Detail} />
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
      dispatch(fetchLeadFields());
      dispatch(fetchLeads({ filter, page, rowsPerPage, orderBy, order }));
    },
    onChangePage: newPage => {
      if (rowsPerPage * newPage >= size(data))
        dispatch(
          fetchLeads({ filter, page: newPage, rowsPerPage, orderBy, order })
        );
    }
  };
};
export default connect(mapStateToProps, null, mergeProps)(
  withStyles(styles)(Lead)
);
