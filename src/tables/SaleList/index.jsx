import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchObjects } from "../actions/objects";
import EnhancedTable from "../Table";
import Add from "./Add";
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
          <Link to="/crm/sale/add">
            <Button
              fab
              color="primary"
              aria-label="add"
              className={classes.buttonAdd}
            >
              <AddIcon />
            </Button>
          </Link>
        </Tooltip>
        <Route path="/crm/sale/add" component={Add} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return state.tables.objects;
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
