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
import { Tooltip, Paper, Checkbox } from "material-ui";
import { Pageview as PageviewIcon, StarBorder as StarBorderIcon, Star as StarIcon } from "material-ui-icons";
import { addToWish, removeFromWish, fetchWish } from "../actions/wish";

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

import tableStyles from './Table.module.css';

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

/**
 * EnhancedTable API:
 * available props:
 *   selected [Object] - array of selected objects
 *   controls [String] - enum:['favorite'] - enable additional control buttons
 */

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    props.init();
  }
  componentWillMount() {
    // fetch wishList on demand
    if (this.props.controls.includes('favorite')) this.props.fetchWish();
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

  addToFavorite = (id) => (e) => {
      e.stopPropagation();
      this.props.addToWish(id);
  };

  removeFromFavorite = (id) => (e) => {
      e.stopPropagation();
      this.props.removeFromWish(id);
  };

  addSelectedtoFavorite = () => {
    // arrow style for save "this" when it pass to child component
    this.props.addToWish(this.props.selected);
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
      onDeleteSelectedData,
      wishData,
      controls
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
          addSelectedToFavorite = {this.addSelectedtoFavorite}
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
                      <TableCell padding="none">
                        <Tooltip title="Подробнее" enterDelay={300}>
                          <Link to={row.url}>
                            <PageviewIcon />
                          </Link>
                        </Tooltip>
                        {controls.includes('favorite') &&
                          <Tooltip title="В избранное" enterDelay={300}>
                            {/*Wrapper needs to anchor Tooltip to current coordinates while Star icons perform changing*/}
                            {/* ATTENTION!: Sometimes fired both titles: native and UI, maybe cause a bug*/}
                            <div className={tableStyles.favoriteWrapper}>
                            {
                              this.props.wishData[row.id] ?
                                <StarIcon onClick={this.removeFromFavorite(row.id)} className={tableStyles.favoriteIcon, tableStyles.favoriteIconActive}/> :
                                <StarBorderIcon className={tableStyles.favoriteIcon} onClick={this.addToFavorite(row.id)}/>
                            }
                            </div>
                          </Tooltip>
                        }
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
  const wishes = state.crm.wish;
  const wishData = wishes.data;
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
    data,
    wishData
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
    },
    addToWish(id) {
      dispatch(addToWish({ objectsId: id, wishId: 0 }));
    },
    removeFromWish(id) {
      dispatch(removeFromWish({ objectsId: id, wishId: 0 }));
    },
    fetchWish() {
      dispatch(fetchWish({wishId: 0}));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(EnhancedTable)
);
