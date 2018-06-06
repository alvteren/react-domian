import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { size } from "lodash";

import Slide from "material-ui/transitions/Slide";
import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import CloseIcon from "material-ui-icons/Close";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import { Hidden } from "material-ui";
import { LinearProgress } from "material-ui";

import {
  openSearch,
  closeSearch,
  fetchSearchResult
} from "../../../actions/form";
import SearchResult from "./SearchResult";
import styles from "./Search.module.css";
import delayedAction from "../../../../util/delayedAction";

import { entitySearch } from "../Location";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class LocationSearch extends React.Component {
  constructor(props) {
    super(props);
    if (size(props.result) === 0) {
      props.fetch();
    }
  }
  componentWillMount() {
    this.delay = new delayedAction();
  }
  state = {
    query: "",
    loading: false
  };
  onChange = e => {
    const { value } = e.target;
    this.setState({ query: value });
    if (value.toString().length > 0) {
      this.delay.do(() => {
        this.props.fetch(value);
      }, 1000);
    }
  };
  render() {
    const { query } = this.state;
    const {
      fullScreen,
      value,
      open,
      closeSearch,
      loading,
      onChangeValue
    } = this.props;
    return (
      open && (
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={closeSearch}
          TransitionComponent={Transition}
        >
          <AppBar color="inherit" className={styles.appBar}>
            <Toolbar>
              <IconButton
                color="primary"
                onClick={closeSearch}
                aria-label="Close"
              >
                <Hidden mdUp>
                  <ArrowBackIcon />
                </Hidden>
                <Hidden smDown>
                  <CloseIcon />
                </Hidden>
              </IconButton>
              <div>
                <TextField
                  type="search"
                  fullWidth
                  label="Поиск"
                  onChange={this.onChange}
                  value={query}
                  autoFocus
                />
              </div>
            </Toolbar>
          </AppBar>
          <div className={styles.progressWrapper}>
            {loading && <LinearProgress variant="query" thickness={1} />}
          </div>
          <DialogContent className={styles.dialogContent}>
            <SearchResult value={value} onChange={onChangeValue} />
          </DialogContent>
        </Dialog>
      )
    );
  }
}

const mapStateToProps = state => {
  const { open, result, loading } = state.crm.form.search[entitySearch];

  return { open, result, loading };
};
const mapDispatchToProps = dispatch => {
  return {
    openSearch: () => {
      dispatch(openSearch({ entitySearch }));
    },
    closeSearch: () => {
      dispatch(closeSearch({ entitySearch }));
    },
    fetch: async query => {
      dispatch(fetchSearchResult({ entitySearch, query }));
    }
  };
};

LocationSearch.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog()(LocationSearch)
);
