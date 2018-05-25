import React, { Fragment } from "react";
import { LinearProgress, Avatar } from "material-ui";
import List, { ListItem, ListItemText } from "material-ui/List";
import { withStyles } from "material-ui/styles";
import { size, map, get } from "lodash";
import { connect } from "react-redux";
import { selectChip } from "../actions/filter";

const styles = theme => {
  return {
    searchWrapper: {
      [theme.breakpoints.up("md")]: {
        position: "absolute",
        top: "100%",
        width: "100%",
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto"
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
    const { classes, chips, loading, open, onChange } = this.props;
    const hasChips = size(chips) > 0;

    return (
      <Fragment>
        {loading && (
          <LinearProgress
            className={classes.loader}
            color="secondary"
            variant="query"
          />
        )}
        {open &&
          hasChips && (
            <div className={classes.searchWrapper}>
              <div className={classes.flex}>
                {hasChips && (
                  <List>
                    {map(chips, chip => {
                      const avatar = get(chip, "avatar", null);

                      return (
                        <ListItem
                          key={chip.id}
                          button
                          onClick={() => {
                            this.props.onApplyChips(chip);
                            onChange && onChange();
                          }}
                        >
                          {avatar &&
                            ("" + avatar).indexOf("/") !== -1 && (
                              <Avatar src={avatar} />
                            )}
                          {avatar &&
                            ("" + avatar).indexOf("/") === -1 && (
                              <Avatar>{avatar}</Avatar>
                            )}
                          <ListItemText
                            primary={chip.label}
                            secondary={chip.propName}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </div>
            </div>
          )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const table = state.crm[ownProps.entityId];
  const { chips, loading } = table;
  return {
    chips,
    loading: loading.chips
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const { entityId } = ownProps;
  return {
    init: () => {},
    onDeleteChip: id => {
      // dispatch(deleteChip({ id: tableId, chipId: id }));
    },
    onFilterChange: query => {
      // dispatch(fetchChips({ id: tableId, query }));
    },
    onApplyChips: chip => {
      dispatch(selectChip({ entityId, chip }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(SearchResult)
);
