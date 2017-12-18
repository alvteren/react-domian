import React from "react";
import { LinearProgress, Chip, Avatar, ClickAwayListener } from "material-ui";
import { withStyles } from "material-ui/styles";
import { size, map, get } from "lodash";

const styles = theme => ({
  searchWrapper: {
    position: "absolute",
    top: "100%",
    left: 0,
    minWidth: "100%",
    maxWidth: `calc(100vw - ${theme.spacing.unit * 2}px)`,
    [`@media screen and (min-width: ${theme.breakpoints.values.md}px)`]: {
      width: "50vw"
    },
    zIndex: 100,
    background: "#fff",
    boxShadow:
      "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
  },
  ChipsWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    overflowY: "none",
    padding: theme.spacing.unit,
    [`@media screen and (min-width: ${theme.breakpoints.values.md}px)`]: {
      overflowX: "none",
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
});
class SearchResult extends React.Component {
  onClickOutside = () => {
    this.props.onClose();
  };
  handleClickOutside = e => {
    this.onClickOutside();
  };
  render() {
    const { classes, chips, loading, open } = this.props;
    const hasChips = size(chips) > 0;
    return (
      <ClickAwayListener onClickAway={this.onClickOutside}>
        {loading && (
          <LinearProgress
            className={classes.loader}
            mode="query"
            thickness={1}
          />
        )}
        {open && (
          <div className={classes.searchWrapper}>
            <div className={classes.ChipsWrapper}>
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
                      label={chip.label}
                      key={chip.id}
                      className={classes.chip}
                    />
                  );
                })}
            </div>
          </div>
        )}
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(SearchResult);
