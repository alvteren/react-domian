import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { size, get } from "lodash";

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

import SearchResult from "./SearchResult";
import styles from "./Search.module.css";
import delayedAction from "../../../../util/delayedAction";
import {
  openSearch,
  closeSearch,
  fetchSearchResult,
  saveSelectedValue
} from "../../../actions/form";

import ButtonSave from "../../../../UI/Modal/ButtonSave";

import { entitySearch } from "../Street";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class ModalSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    const { locationId } = props;
    if (size(props.result) === 0) {
      props.fetch({ query: "", locationId });
    }
  }
  componentWillMount() {
    this.delay = new delayedAction();
  }
  state = {
    query: this.props.value,
    loading: false
  };
  onChange = e => {
    const { value } = e.target;
    const { locationId } = this.props;

    this.setState({ query: value });

    if (value.toString().length > 0) {
      this.delay.do(() => {
        this.props.fetch({ query: value, locationId });
      }, 1000);
    }
  };

  onSave = () => {
    const { query } = this.state;

    this.props.closeSearch();
    this.props.onChangeValue(query);
    this.props.saveSelectedValue({ value: query });
  };

  render() {
    const { query } = this.state;
    const {
      fullScreen,
      value,
      closeSearch,
      loading,
      onChangeValue
    } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={true}
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
            <ButtonSave onClick={this.onSave}>Вставить</ButtonSave>
          </Toolbar>
        </AppBar>
        <div className={styles.progressWrapper}>
          {loading && <LinearProgress variant="query" thickness={1} />}
        </div>
        <DialogContent className={styles.dialogContent}>
          <SearchResult onChange={onChangeValue} {...this.props} />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { result, loading } = state.crm.form.search[entitySearch];
  const { entityId, elementId } = ownProps;
  //prettier-ignore
  const locationId = get(state, `crm.${entityId}.values.${elementId}.location.value`, 0);

  return { result, loading, locationId };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openSearch: () => {
      dispatch(openSearch({ entitySearch }));
    },
    closeSearch: () => {
      dispatch(closeSearch({ entitySearch }));
    },
    fetch: async ({ query, locationId }) => {
      dispatch(fetchSearchResult({ entitySearch, query, locationId }));
    },
    saveSelectedValue: value => {
      dispatch(saveSelectedValue({ entitySearch, value }));
    }
  };
};

ModalSearch.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMobileDialog()(ModalSearch));
