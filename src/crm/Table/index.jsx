import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import keycode from "keycode";
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "material-ui/Table";
import Tooltip from "material-ui/Tooltip";
import Paper from "material-ui/Paper";
import Checkbox from "material-ui/Checkbox";
import PageviewIcon from "material-ui-icons/Pageview";

import EnhancedToolbar from "./EnhancedToolbar";
import Head from "./Head";
import Pagination from "./Pagination";

import { toArray, isObject } from "lodash";

import {
  fetchTableHeaders,
  toggleRow,
  toggleAllRow,
  requestSort
} from "../actions/table";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: "auto"
  },
  nowrap: {
    whiteSpace: "nowrap"
  }
});
class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    props.init();
  }
  handleRequestSort = (event, property) => {
    this.props.onRequestSort(property);
  };

  handleSelectAllClick = (event, checked) => {
    this.props.onToggleAllRow(checked);
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === "space") {
      this.handleClick(event, id);
    }
  };

  handleClick = (event, id) => {
    this.props.onToggleRow(id);
  };

  isSelected = id => {
    return this.props.selected.indexOf(id) !== -1;
  };

  render() {
    const {
      id,
      classes,
      data,
      selected,
      rowsPerPage,
      page,
      loading,
      headerData,
      fields,
      filterComponent,
      onChangePage,
      onDeleteSelectedData
    } = this.props;

    const arData = toArray(data);
    const emptyRows = () => {
      if (loading.data && arData.length > 0) {
        return (
          rowsPerPage -
          Math.min(rowsPerPage, arData.length - page * rowsPerPage) -
          1
        );
      }
      return (
        rowsPerPage - Math.min(rowsPerPage, arData.length - page * rowsPerPage)
      );
    };

    const arHeaderData = toArray(headerData);

    const formatValue = params => {
      const { id, value, row } = params;
      const currency = row.currency || "RUB";
      if (value != null) {
        if (id === "price") {
          return new Intl.NumberFormat("ru-Ru", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value * 1);
        }
        if (id === "contacts") {
          return <span className={classes.nowrap}>{value}</span>;
        }

        if (isObject(value) && value.hasOwnProperty("label")) {
          return value.label;
        }
        console.log(id);
        if (fields.hasOwnProperty(id) && fields[id].type === "select") {
          if (fields[id].items && fields[id].items.hasOwnProperty(value)) {
            return fields[id].items[value].label;
          }
        }

        return value;
      }

      return " ";
    };

    return (
      <Paper className={classes.root}>
        <EnhancedToolbar
          numSelected={selected.length}
          id={id}
          onDeleteSelectedData={onDeleteSelectedData}
          filterComponent={filterComponent}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <Head
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={arData.length}
              headerData={headerData}
              numSelected={selected.length}
              id={id}
            />
            <TableBody>
              {arData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  const isSelected = this.isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, row.id)}
                      onKeyDown={event => this.handleKeyDown(event, row.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Подробнее" enterDelay={300}>
                          <Link to={row.url}>
                            <PageviewIcon />
                          </Link>
                        </Tooltip>
                      </TableCell>
                      {arHeaderData.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={"" + column.id + row.id}>
                            {formatValue({
                              id: column.id,
                              value,
                              row: row
                            })}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {(arData.length === 0 || loading.data) && (
                <TableRow>
                  <TableCell
                    colSpan={arHeaderData.length + 2}
                    style={{ textAlign: "center" }}
                  >
                    {loading.data ? "Данные загружаются..." : "Данных нет"}
                  </TableCell>
                </TableRow>
              )}
              {emptyRows() > 0 && (
                <TableRow style={{ height: 49 * emptyRows() }}>
                  <TableCell colSpan={arHeaderData.length} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <Pagination id={id} onChangePage={onChangePage} />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, ownProps) => {
  const table = state.crm[ownProps.id];
  const {
    headers,
    fields,
    selected,
    rowsPerPage,
    page,
    data,
    status,
    count,
    loading
  } = table;
  return {
    headerData: headers,
    fields,
    count,
    selected,
    rowsPerPage,
    page,
    loading,
    status,
    data
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const tableId = ownProps.id;
  return {
    init: () => {
      dispatch(fetchTableHeaders(tableId));
    },
    onToggleRow: id => {
      dispatch(toggleRow({ id: tableId, rowId: id }));
    },
    onToggleAllRow: checked => {
      dispatch(toggleAllRow({ id: tableId, checked }));
    },
    onRequestSort: property => {
      dispatch(requestSort({ id: tableId, orderBy: property }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(EnhancedTable)
);
