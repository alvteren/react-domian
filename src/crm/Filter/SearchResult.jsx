import React, { Fragment } from "react";
import { LinearProgress, Chip, Avatar } from "material-ui";
import { withStyles } from "material-ui/styles";
import { size, map, get } from "lodash";
import { connect } from "react-redux";
import { selectChip } from "../actions/filter";

import Form from "./Form";

const styles = theme => {
  return {
    searchWrapper: {
      position: "absolute",
      top: "100%",
      left: 0,
      padding: theme.spacing.unit,
      width: `calc(100vw - ${theme.spacing.unit * 4}px)`,
      [theme.breakpoints.up("sm")]: {
        width: `calc(100vw - ${theme.spacing.unit * 6}px)`
      },
      [theme.breakpoints.up("md")]: {
        // [`@media screen and (min-width: ${theme.breakpoints.values.md}px)`]: {
        width: "50vw"
      },
      zIndex: 100,
      background: "#fff",
      boxShadow:
        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
    },
    flex: {
      display: "flex",
      alignItems: "center",
      overflowX: "auto",
      [theme.breakpoints.up("md")]: {
        overflowX: "visible",
        flexWrap: "wrap"
      }
    },
    chip: {
      margin: theme.spacing.unit / 2
    },
    label: {
      fontSize: 14,
      margin: theme.spacing.unit / 2
    },
    loader: {
      width: "100%",
      position: "absolute",
      bottom: "0"
    }
  };
};
class SearchResult extends React.Component {
  render() {
    const { classes, chips, loading, open, id, presetsChips } = this.props;
    const hasChips = size(chips) > 0;
    const hasPresetsChips = size(presetsChips) > 0;
    return (
      <Fragment>
        {loading && (
          <LinearProgress
            className={classes.loader}
            color="secondary"
            variant="query"
          />
        )}
        {open && (
          <div className={classes.searchWrapper}>
            <div className={classes.flex}>
              {hasPresetsChips &&
                map(presetsChips, chip => {
                  const chipProps = {};
                  const avatar = get(chip, "avatar", null);
                  if (avatar) {
                    if (("" + avatar).indexOf("/") !== -1) {
                      chipProps.avatar = <Avatar src={avatar} />;
                    } else {
                      chipProps.avatar = <Avatar>{avatar}</Avatar>;
                    }
                  }
                  return (
                    <Chip
                      {...chipProps}
                      label={
                        Boolean(chip.propName)
                          ? `${chip.propName}: ${chip.label}`
                          : chip.label
                      }
                      key={chip.id}
                      className={classes.chip}
                      onClick={() => this.props.onApplyChips(chip)}
                    />
                  );
                })}
            </div>
            <div className={classes.flex}>
              {hasChips &&
                map(chips, chip => {
                  const chipProps = {};
                  const avatar = get(chip, "avatar", null);
                  if (avatar) {
                    if (("" + avatar).indexOf("/") !== -1) {
                      chipProps.avatar = <Avatar src={avatar} />;
                    } else {
                      chipProps.avatar = <Avatar>{avatar}</Avatar>;
                    }
                  }
                  return (
                    <Chip
                      {...chipProps}
                      label={
                        Boolean(chip.propName)
                          ? `${chip.propName}: ${chip.label}`
                          : chip.label
                      }
                      key={chip.id}
                      className={classes.chip}
                      onClick={() => this.props.onApplyChips(chip)}
                    />
                  );
                })}
            </div>
            <Form id={id} />
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const table = state.crm[ownProps.id];
  const { chips, loading, presetsChips } = table;
  return {
    chips,
    loading: loading.chips,
    presetsChips
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const tableId = ownProps.id;
  return {
    init: () => {},
    onDeleteChip: id => {
      // dispatch(deleteChip({ id: tableId, chipId: id }));
    },
    onFilterChange: query => {
      // dispatch(fetchChips({ id: tableId, query }));
    },
    onApplyChips: chip => {
      dispatch(selectChip({ id: tableId, chip }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(SearchResult)
);
