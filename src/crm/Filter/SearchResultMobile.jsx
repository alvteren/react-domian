import React from "react";
import { connect } from "react-redux";

import Slide from "material-ui/transitions/Slide";
import Dialog, { DialogContent } from "material-ui/Dialog";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import ArrowBackIcon from "material-ui-icons/ArrowBack";

import SearchResult from "./SearchResult";
import styles from "./SearchResultMobile.module.css";
import delayedAction from "../../util/delayedAction";
import { activeTool, deactivedTool } from "../../app/actions/tools";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class SearchResultMobile extends React.Component {
  componentWillMount() {
    this.delay = new delayedAction();
  }
  state = {
    query: ""
  };
  onChange = e => {
    const { value } = e.target;
    this.setState({ query: value });
    if (value.toString().length > 0) {
      this.delay.do(() => {
        this.props.onFilterChange(value);
      }, 1000);
    }
  };
  render() {
    const { query } = this.state;
    const { id, open, closeSearch } = this.props;
    return (
      open && (
        <Dialog
          fullScreen={true}
          open={open}
          onClose={closeSearch}
          transition={Transition}
        >
          <AppBar color="inherit" className={styles.appBar}>
            <Toolbar>
              <IconButton
                color="primary"
                onClick={closeSearch}
                aria-label="Close"
              >
                <ArrowBackIcon />
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
          <DialogContent className={styles.dialogContent}>
            <SearchResult
              id={id}
              onChange={this.props.closeSearch}
              open={true}
            />
          </DialogContent>
        </Dialog>
      )
    );
  }
}

const mapStateToProps = state => {
  const { active, loading } = state.app.tools.objects.search;

  return { open: active, loading };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const { id } = ownProps;
  return {
    openSearch: () => {
      dispatch(activeTool({ entity: id, toolId: "search" }));
    },
    closeSearch: () => {
      dispatch(deactivedTool({ entity: id, toolId: "search" }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMobile);
