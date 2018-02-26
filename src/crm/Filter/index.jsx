import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { TextField, Chip, Avatar } from "material-ui";
import { connect } from "react-redux";
import { map, get, size } from "lodash";
import { deleteChip, fetchChips } from "../actions/filter";
import SearchResult from "./SearchResult";

import styles from "./Filter.module.css";

const muiStyles = theme => ({
  chipsWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    overflowY: "hidden",
    padding: theme.spacing.unit,
    [theme.breakpoints.up("md")]: {
      overflowX: "visible",
      flexWrap: "wrap"
    }
  }
});

const WAIT_INTERVAL = 500;

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
    this.timer = null;
  }
  handleChange = event => {
    const { value } = event.target;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.openPopover();
      this.props.onFilterChange(value);
    }, WAIT_INTERVAL);
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
    // setTimeout(this.handleRequestClose, 200);
  };
  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { id, classes, value, selectedChips, onDeleteChip } = this.props;

    const { open } = this.state;

    return (
      <div className={styles.filterWrapper}>
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
    onApplyChips: () => {}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(muiStyles)(Filter)
);
