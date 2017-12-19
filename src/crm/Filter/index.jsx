import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { TextField, Chip, Avatar } from "material-ui";
import { connect } from "react-redux";
import { map, get, size } from "lodash";
import { deleteChip, fetchChips } from "../actions/filter";
import SearchResult from "./SearchResult";

const styles = theme => ({
  filterTextField: {
    width: 300
  },
  chip: {
    margin: theme.spacing.unit / 2
  },
  chipAdd: {
    margin: theme.spacing.unit / 2,
    cursor: "pointer",
    "&:hover .material-icons": {
      opacity: 1
    },
    "& .material-icons": {
      opacity: 0.8,
      transition: "1s"
    }
  },
  chipsWrapper: {
    display: "flex",
    flexWrap: "wrap"
  },
  filterWrapper: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline"
  },
  textFieldWrapper: {
    display: "flex",
    flexDirection: "column",
    position: "relative"
  }
});

const WAIT_INTERVAL = 1000;

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
    const hasChips = size(newProps.chips) > 0;
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
    this.setState({
      open: false
    });
  };
  onFocus = () => {
    this.state.hasChips && this.openPopover();
  };
  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {
      classes,
      value,
      selectedChips,
      onDeleteChip,
      chips,
      loading
    } = this.props;

    const { open } = this.state;

    return (
      <div className={classes.filterWrapper}>
        <div className={classes.textFieldWrapper}>
          <TextField
            id="searchField"
            label="Поиск"
            className={classes.filterTextField}
            value={value}
            onChange={this.handleChange}
            onFocus={this.onFocus}
          />
          <SearchResult
            chips={chips}
            loading={loading.chips}
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
                label={chip.label}
                onRequestDelete={() => {
                  onDeleteChip(chip.id);
                }}
                key={chip.id}
                className={classes.chip}
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
    loading,
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
    loading,
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
  withStyles(styles)(Filter)
);
