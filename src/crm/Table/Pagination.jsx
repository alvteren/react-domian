import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { TablePagination } from "material-ui/Table";

import { changeRowsPerPage, changePage } from "../actions/table";

import { connect } from "react-redux";

import { get } from "lodash";

const styles = theme => ({
  root: {
    border: "1px solid #f00"
  },
  spacer: {
    flex: "0 0 auto"
  }
});

const Pagination = props => {
  const { classes, rowsPerPage, page, count } = props;

  const handleChangePage = (event, page) => {
    props.onChangePage(page);
  };

  const handleChangeRowsPerPage = event => {
    props.onChangeRowsPerPage(event.target.value);
  };

  return (
    <TablePagination
      classes={classes}
      labelRowsPerPage="Строк на странице"
      count={parseInt(count, 10)}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
    />
  );
};
const mapStateToProps = (state, ownProps) => {
  const { count, rowsPerPage, page } = state.crm[ownProps.entityId];
  return { count, rowsPerPage, page };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const { entityId } = ownProps;
  return {
    onChangePage: page => {
      dispatch(changePage({ entityId, page }));
      const onChangePage = get(ownProps, "onChangePage", null);
      if (onChangePage) {
        onChangePage(page);
      }
    },
    onChangeRowsPerPage: rowsPerPage => {
      dispatch(changeRowsPerPage({ entityId, rowsPerPage }));
      const onChangeRowsPerPage = get(ownProps, "onChangeRowsPerPage", null);
      if (onChangeRowsPerPage) {
        onChangeRowsPerPage(rowsPerPage);
      }
    }
  };
};
Pagination.propTypes = {
  entityId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Pagination)
);
