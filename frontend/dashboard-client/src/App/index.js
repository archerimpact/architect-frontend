import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/actions/';

import { Route, Redirect, Switch, withRouter} from 'react-router-dom';
import PrivateRoute from './PrivateRoute/';


import NavBar from '../components/NavBar/';
import Login from '../pages/Login/';
import CreateAccount from '../pages/CreateAccount/';
import Home from '../pages/Home/';
import Canvas from '../pages/Canvas/';
import Source from '../pages/Source/';
import Sources from '../pages/Sources/';
import Entities from '../pages/Entities/';

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
    				<PrivateRoute path="/project/:id" component={Canvas} />				    		
    				<PrivateRoute path="/source/:id" component={Source}/>
                    <PrivateRoute path="/sources/:id" component={Sources}/>
                    <PrivateRoute path="/entities/:id" component={Entities}/>
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

