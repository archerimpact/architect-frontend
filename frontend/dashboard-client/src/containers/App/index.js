import React, {Component} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import { Route, Redirect, Switch, withRouter} from 'react-router-dom';
import Login from '../../components/Login/loginPage.js'

import Home from '../../pages/Home/';
import Project from '../../pages/Project/';
import Source from '../../pages/Source/';
import Canvas from '../../pages/Canvas/';
import BackendSearch from '../../pages/BackendSearch/';

import PrivateRoute from '../Login/PrivateRoute';
import NavBar from '../../components/NavBar/';
import CreateAccount from "../../components/Login/createAccount";
import NewHome from '../../pages/Home/newHome.js';

class App extends Component {

	constructor(props) {
		super(props);
	}

	logOut() {
		return this.props.actions.userLogOut();
	}

	logIn() {
		return (<Redirect to={'/login'}/>)
	}

    render() {
        return ( 
        	<div>
    			<NavBar isAuthenticated={this.props.isAuthenticated} logOut={this.logOut.bind(this)} logIn={this.logIn.bind(this)} />
    			<Switch>
    				<PrivateRoute exact path="/" component={Home} />
    				<Route path="/login" component={Login} />
            <Route path="/create_account" component={CreateAccount} />
    				<PrivateRoute path="/project/:id" component={Project} />				    		
    				<PrivateRoute path="/source/:id" component={Source}/>
            <PrivateRoute path="/projectcanvas/:id" component={Canvas}/>
            <PrivateRoute path="/homepage" component={NewHome}/>
            <PrivateRoute path="/backendsearch" component={BackendSearch} />
				</Switch>
      
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

