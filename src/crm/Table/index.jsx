import React, {Fragment} from "react";
import PropTypes from "prop-types";
import keycode from "keycode";
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "material-ui/Table";
import { Tooltip, Paper, Checkbox } from "material-ui";
import { Pageview as PageviewIcon } from "material-ui-icons";

import EnhancedToolbar from "./EnhancedToolbar";
import Head from "./Head";
import Pagination from "./Pagination";
import MobileStepper from 'material-ui/MobileStepper';
import { withStyles } from "material-ui/styles";

import { toArray, isObject, get } from "lodash";
import { formatDate } from "../../util/leadDataConverter";

import {
  fetchTableHeaders,
  toggleRow,
  toggleAllRow,
  requestSort
} from "../actions/table";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./Table.module.css";
const style = {
  progress: {
    width: `100%`,
  }
};

/**
 * EnhancedTable API:
 * available props:
 *   @selected [Object] - array of selected objects
 *   @controlComponents React.Component - enable components for additional control buttons
 *   @filterComponent React.Component - enable filter component
 *   @groupActionsComponents React.Component - enable component for buttons of group actions
 */

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
      data,
      selected,
      rowsPerPage,
      page,
      loading,
      headerData,
      fields,
      filterComponent,
      groupActionsComponent,
      controlComponents,
      onChangePage,
      classes
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
      if (id === "reminders") {
        if (value instanceof Object) {
          if (get(row, "can.edit", false)) {
            if (Object.keys(value).length) {
              return (
                <Fragment>
                  {Object.keys(value).map((item, index) => {
                    return (
                      <div key={index}>
                        <p>{(formatDate(value[item].date))}</p>
                        <p>{value[item].theme}</p>
                      </div>
                    )})
                  }
                </Fragment>
              )
            }
            return (
              <Link
                to={`lead/${row.id}/reminder/new`} // ?????
                onClick={e => {e.stopPropagation();}}>
                Создать напоминание
              </Link>
            )
          }
          return " ";
        }
      }
      if (value != null) {
        if (id === "price") {
          const currency = row.currency || "RUB";
          return new Intl.NumberFormat("ru-Ru", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value * 1);
        }
        if (id === "contacts" || id === "phone") {
          return <span className={styles.nowrap}>{value}</span>;
        }

        if (isObject(value) && value.hasOwnProperty("label")) {
          return value.label;
        }
        if (get(fields, `${id}.type`, null) === "select") {
          if (fields[id].items && fields[id].items.hasOwnProperty(value)) {
            return fields[id].items[value].label;
          }
        }
        if (Array.isArray(value)) {
          // wishes list case: [String]
          return (
            <div>
              {value.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
            </div>
          );
        }
        if (id === "status_id") {
          const val = value.toLowerCase();
          if (get(fields, `fields.status_id.items${val}`.label, null)) {
            const statusToStep = {
              NEW: 1,
              ASSIGNED: 2,
              DETAILS: 3,
              CONVERTED: 4,
              JUNK: 0
            };
            const step = statusToStep[fields.status_id.items[val].value];
            return (
              <div>
                <MobileStepper
                  variant="progress"
                  steps={5}
                  position="static"
                  activeStep={step}
                  classes={{progress: classes.progress}}
                />
                <span>{fields.status_id.items[val].label}</span>
              </div>
            )
          }
        }
        return value;
      }

      return " ";
    };

    return (
      <Paper className={styles.root}>
        <EnhancedToolbar
          numSelected={selected.length}
          id={id}
          filterComponent={filterComponent}
          groupActionsComponent={groupActionsComponent} 
        />
        <div className={styles.tableWrapper}>
          <Table className={styles.table}>
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
                        <div className={styles.controlsWrapper}>
                          <Tooltip title="Подробнее" enterDelay={300}>
                            <Link
                              to={row.url || `show/${id}/${row.id}`}
                              onClick={e => {
                                e.stopPropagation();
                              }}
                            >
                              <PageviewIcon />
                            </Link>
                          </Tooltip>
                          {controlComponents &&
                            React.createElement(controlComponents, {
                              id: row.id,
                              entityId: id
                            })}
                        </div>
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
  id: PropTypes.string.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(EnhancedTable));
