import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {userLogOut} from "../redux/actions/userActions";
import PrivateRoute from "./PrivateRoute"
import Login from "../components/Login";
import Canvas from "../components/Canvas";

import "./style.css";

class App extends Component {

    logOut() {
        return this.props.dispatch(userLogOut());
    }

    logIn() {
        return (<Redirect to={'/'}/>);
    }

    render() {
        return (
          <div>
            <div className="main">
                <Route exact path="/" component={Login}/>
                <PrivateRoute path="/explore/:sidebarState?/:query?" component={Canvas}/>
            </div>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

export default withRouter(connect(mapDispatchToProps)(App));
