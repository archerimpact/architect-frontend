import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRouter = ({ component: Component, ...rest, isAuthenticated }) => (
  <Route {...rest} render={props => (
    isAuthenticated ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
)

class PrivateRoute extends Component {

  render() {
    return (<PrivateRouter component={this.props.component} {...this.props} isAuthenticated={this.props.isAuthenticated} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.data.user.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));
