import React from "react";
import { connect } from "react-redux";
import { fetchWish, removeFromWish } from "../actions/wish";
import EnhancedTable from "../Table";

const mapStateToProps = state => {
  const { wishId, selected } = state.crm.wish;
  return { wishId, selected };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { wishId, selected } = stateProps;
  const { dispatch } = dispatchProps;
  return {
    ...stateProps,
    ...ownProps,
    init: () => {
      dispatch(fetchWish({ wishId }));
    },
    onDeleteSelectedData: () => {
      dispatch(removeFromWish({ wishId, objectsId: selected }));
    }
  };
};

class WishList extends React.Component {
  constructor(props) {
    super(props);
    props.init(props.wishId);
  }

  render() {
    return (
      <EnhancedTable
        id="wish"
        onDeleteSelectedData={this.props.onDeleteSelectedData}
      />
    );
  }
}

export default connect(mapStateToProps, null, mergeProps)(WishList);
