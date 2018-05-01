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

  constructor(props) {
    super(props);
    this.isNavbarVisible = this.isNavbarVisible.bind(this);
    this.state = {
      navbarVisible: this.isNavbarVisible(props),
    };
  }

  componentDidMount() {
    this.setState({navbarVisible: this.isNavbarVisible(this.props)})
	}

	componentWillReceiveProps(nextProps){
    this.setState({navbarVisible: this.isNavbarVisible(nextProps)})
	}

  logOut() {
    return this.props.actions.userLogOut();
  }

  logIn() {
    return (<Redirect to={'/login'} />);
  }

  isNavbarVisible(props) {
    var exploreCanvasPath = RegExp('\/explore\/*');
    var buildCanvasPath = RegExp('\/build\/\\d+');
    let currentPath = props.location.pathname;
		if (exploreCanvasPath.test(currentPath) || buildCanvasPath.test(currentPath)) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        { !this.state.navbarVisible ? 
          null : 
          <NavBar isAuthenticated={this.props.isAuthenticated} logOut={this.logOut.bind(this)} logIn={this.logIn.bind(this)} />
        }
        <div className={"main " + (this.state.navbarVisible ? "show-nav" : "no-nav")}>
          <PrivateRoute exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/create_account" component={CreateAccount} />
          <PrivateRoute path="/explore/:sidebarState?" component={Canvas} />
          <PrivateRoute path="/build/:investigationId" component={Canvas} />
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
