import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/actions/';

import { Route, Redirect, withRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute/';

import NavBar from '../components/NavBar/';

import Login from '../pages/Login/';
import CreateAccount from '../pages/CreateAccount/';
import Home from '../pages/Home/';
import Canvas from '../pages/Canvas';
import Investigations from '../pages/Investigations';
import './style.css';

class App extends Component {

  logOut() {
    return this.props.actions.userLogOut();
  }

  logIn() {
    return (<Redirect to={'/login'} />);
  }

  render() {
    return (
      <div>
        <NavBar isAuthenticated={this.props.isAuthenticated} logOut={this.logOut.bind(this)} logIn={this.logIn.bind(this)} />
        <div className="main">
          <PrivateRoute exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/create_account" component={CreateAccount} />
          <PrivateRoute path="/explore/:sidebarState" component={Canvas} />
          <PrivateRoute path="/build/:investigationId" component={Canvas} /> {/* TODO pass in investigationID as a prop*/}
          <PrivateRoute exact path="/build" component={Investigations} />
        </div>
      </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
