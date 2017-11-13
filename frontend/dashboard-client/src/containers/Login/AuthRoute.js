import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated as isAuthed} from '../../server/transport-layer.js';

//Mock of an Auth method, can be replaced with an async call to the backend. Must return true or false
// const isAuthenticated = () => {
//   isAuthed().then(res => {
//     return res.success
//   })
//   .catch(err => {
//     return false
//   })
// };

const PRIVATE_ROOT = '/';
const PUBLIC_ROOT = '/login';

class AuthRoute extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated : false,
      isPublic : props.component.isPublic,
    }
  }

  componentDidMount() {
    var self = this
    isAuthed().then(res => {
      debugger
      self.setState({
        isAuthenticated: res.success
      })
    })
    .catch(err => {
      debugger
      self.setState({
        isAuthenticated: false
      })
    })
  }

  render() {
    debugger
    if (this.state.isAuthenticated) {
      //User is Authenticated
      return <Route { ...this.props } component={this.props.component} />;
    } else {
      //User is not Authenticated
      if (this.state.isPublic === true) {
        //If the route is private the user is redirected to the app's public root.
        return <Route { ...this.props } component={ this.props.component } />;
      }
      else {
        //If the route is public, the user may proceed.
        return <Redirect to={ PUBLIC_ROOT } />;
      }
    }
  }
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ])
};

export default AuthRoute;