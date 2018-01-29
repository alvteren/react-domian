import React, { Fragment } from "react";
import { connect } from "react-redux";

import MenuAdd from "../Menu/Add";

import { Button } from "material-ui";
import AddIcon from "material-ui-icons/Add";
import { Route } from "react-router-dom";

import styles from "./List.module.css";

import size from "lodash/size";

class AlianceList extends React.Component {
  constructor(props) {
    super(props);
    props.onInit();
  }
  state = {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const open = Boolean(this.state.anchorEl);

    return (
      <Fragment>
        <Button
          fab
          color="primary"
          aria-label="add"
          className={styles.buttonAdd}
          onClick={this.handleClick}
        >
          <AddIcon />
        </Button>
        <MenuAdd
          anchorEl={this.state.anchorEl}
          open={open}
          onClose={this.handleClose}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { filter, page, rowsPerPage, orderBy, order, data } = state.crm.objects;
  return {
    filter,
    page,
    rowsPerPage,
    orderBy,
    order,
    data
  };
};
const mergeProps = (stateProps, dispatchProps) => {
  const { filter, page, rowsPerPage, orderBy, order, data } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    onInit: () => {
      // dispatch(fetchObjects({ filter, page, rowsPerPage, orderBy, order }));
    }
  };
};
export default connect(mapStateToProps, null, mergeProps)(AlianceList);
