import React from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel
} from "material-ui/Table";
import Checkbox from "material-ui/Checkbox";
import Tooltip from "material-ui/Tooltip";
import toArray from "lodash/toArray";
import { connect } from "react-redux";

const Head = props => {
  const createSortHandler = property => event => {
    props.onRequestSort(event, property);
  };

  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    headerData
  } = props;

  const arHeaderData = toArray(headerData);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        <TableCell />

        {arHeaderData.map(column => {
          return (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding ? "none" : "default"}
            >
              <Tooltip
                title="Сортировать"
                placement={column.numeric ? "bottom-end" : "bottom-start"}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
const mapStateToProps = (state, ownProps) => {
  const { order, orderBy, tooltipTitle } = state.tables[ownProps.id];
  return { order, orderBy, tooltipTitle };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Head);
