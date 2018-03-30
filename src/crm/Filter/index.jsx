import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { TextField, Chip, Avatar, Hidden } from "material-ui";
import { connect } from "react-redux";
import { map, get, size } from "lodash";

import { deleteChip, fetchChips, selectChip } from "../actions/filter";

import SearchResult from "./SearchResult";
import SearchResultMobile from "./SearchResultMobile";

import delayedAction from "../../util/delayedAction";

import styles from "./Filter.module.css";

const muiStyles = theme => ({
  chipsWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    overflowY: "hidden",
    padding: theme.spacing.unit,
    width: "calc(100% + 16px)",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      overflowX: "visible",
      flexWrap: "wrap"
    }
  },
  chipPreset: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit / 2,
    "&:hover, &:focus": {
      background: theme.palette.primary.dark
    }
  }
});

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      hasChips: false,
      open: false
    };
  }
  componentWillReceiveProps(newProps) {
    const hasChips =
      size(newProps.chips) > 0 || size(newProps.presetsChips) > 0;
    this.setState({ hasChips });
  }
  componentWillMount() {
    this.delay = new delayedAction();
  }
  handleChange = event => {
    const { value } = event.target;
    this.delay.do(() => {
      if (("" + value).length > 0) {
        this.openPopover();
        this.props.onFilterChange(value);
      }
    });
  };
  openPopover = () => {
    this.setState({
      open: true,
      anchorEl: document.querySelector("#searchField")
    });
  };
  onCloseSearchResult = () => {
    this.handleRequestClose();
  };
  onFocus = () => {
    this.state.hasChips && this.openPopover();
  };
  onFocusOut = () => {
    setTimeout(this.handleRequestClose, 200);
  };
  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {
      id,
      classes,
      value,
      selectedChips,
      onDeleteChip,
      onFilterChange,
      presetsChips
    } = this.props;
    const hasPresetsChips = size(presetsChips) > 0;

    const { open } = this.state;

    return (
      <Fragment>
        <div className={styles.filterWrapper}>
          <Hidden smDown>
            <div className={styles.textFieldWrapper}>
              <TextField
                id="searchField"
                label="Поиск"
                className={styles.filterTextField}
                value={value}
                onChange={this.handleChange}
                onFocus={this.onFocus}
                onBlur={this.onFocusOut}
              />
              <SearchResult
                id={id}
                open={open}
                onClose={this.onCloseSearchResult}
              />
            </div>
          </Hidden>
          <Hidden mdUp>
            <SearchResultMobile onFilterChange={onFilterChange} id={id} />
          </Hidden>
          <div className={classes.chipsWrapper}>
            {map(selectedChips, chip => {
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
                  onDelete={() => {
                    onDeleteChip(chip.id);
                  }}
                  key={chip.id}
                  className={styles.chip}
                />
              );
            })}
          </div>
        </div>
        <div className={classes.chipsWrapper}>
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
                  className={classes.chipPreset}
                  onClick={() => this.props.onApplyChips(chip)}
                />
              );
            })}
        </div>
      </Fragment>
    );
  }
}
Filter.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, ownProps) => {
  const table = state.crm[ownProps.id];
  const {
    headers,
    selected,
    rowsPerPage,
    page,
    data,
    status,
    count,
    chips,
    presetsChips,
    selectedChips
  } = table;
  return {
    headerData: headers,
    count,
    selected,
    rowsPerPage,
    page,
    status,
    data,
    chips,
    presetsChips,
    selectedChips
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const tableId = ownProps.id;
  return {
    init: () => {},
    onDeleteChip: id => {
      dispatch(deleteChip({ id: tableId, chipId: id }));
    },
    onFilterChange: query => {
      dispatch(fetchChips({ id: tableId, query }));
    },
    onApplyChips: chip => {
      dispatch(selectChip({ id: tableId, chip }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(muiStyles)(Filter)
);
