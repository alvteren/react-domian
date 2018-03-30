import React from "react";
import {connect} from "react-redux";
import {updateParams} from "./actions/routeapp";

class RouteApp extends React.Component {
  componentWillUpdate(){
    this.props.onUpdateParams();
  }
  return <span />;
};

const mapStateToProps = (state,ownProps) => {
  const {params} = ownProps;
  return {params};
}

const mergeProps = (stateProps, dispatchProps)
{
  const {dispatch} = dispatchProps;
  const {params} = stateProps;

  return {
    onUpdateParams: () => {
      dispatch(updateParams(params));
    }
  }
}

export default connect(mapStateToProps, null, mergeProps)(RouteApp);
