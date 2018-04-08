import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/actions/';

import { Route, Redirect, Switch, withRouter} from 'react-router-dom';
import PrivateRoute from './PrivateRoute/';

import NavBar from '../components/NavBar/';
// import SideBar from '../components/SideBar';

import Login from '../pages/Login/';
import CreateAccount from '../pages/CreateAccount/';
import Home from '../pages/Home/';
import Entity from '../pages/Entity/';
import BackendSearch from '../pages/BackendSearch';
import './style.css';
class App extends Component {

	constructor(props) {
		super(props);
	}

	logOut() {
		return this.props.actions.userLogOut();
	}

	logIn() {
		return (<Redirect to={'/login'}/>);
	}

  render() {
    return ( 
    	<div>
  			<NavBar isAuthenticated={this.props.isAuthenticated} logOut={this.logOut.bind(this)} logIn={this.logIn.bind(this)} />
          {/*<SideBar isAuthenticated={this.props.isAuthenticated}/>*/}
        <div className="main">
      		<Switch>
    				<PrivateRoute exact path="/" component={Home} />
    				<Route path="/login" component={Login} />
            <Route path="/create_account" component={CreateAccount} />
            <PrivateRoute path="/search" component={BackendSearch} />
            <PrivateRoute path="/entity/:neo4j_id" component={Entity} />
  				</Switch>
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