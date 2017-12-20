import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchObjects } from "../actions/objects";
import EnhancedTable from "../Table";
import Add from "./Add";
import Detail from "./Detail";
import Filter from "../Filter";
import { withStyles } from "material-ui/styles";
import { Button, Tooltip } from "material-ui";
import AddIcon from "material-ui-icons/Add";
import { Link, Route } from "react-router-dom";

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

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <EnhancedTable
          id="objects"
          onChangePage={this.props.onChangePage}
          filterComponent={<Filter id="objects" />}
        />
        <Tooltip title="Добавить объект" placement="top">
          <Button
            fab
            component={props => <Link to="/crm/sale/add" {...props} />}
            color="primary"
            aria-label="add"
            className={classes.buttonAdd}
          >
            <AddIcon />
          </Button>
        </Tooltip>
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
const mergeProps = (stateProps, dispatchProps) => {
  const { filter, page, rowsPerPage, orderBy, order, data } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    onInit: () => {
      dispatch(fetchObjects({ filter, page, rowsPerPage, orderBy, order }));
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
