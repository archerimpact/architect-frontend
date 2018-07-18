import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import {userLogOut} from "../redux/actions/userActions";
import PrivateRoute from "./PrivateRoute"
import Login from "../components/Login";
import Canvas from "../components/Canvas";

import "./style.css";

export default class App extends Component {

    logOut() {
        return this.props.dispatch(userLogOut());
    }

    logIn() {
        return (<Redirect to={'/login'}/>);
    }

    render() {
        return (
          <div>
            <div className="main">
                <Route path="/login" component={Login}/>
                <PrivateRoute path="/explore/:sidebarState?/:query?" component={Canvas}/>
            </div>
          </div>
        );
    }
}