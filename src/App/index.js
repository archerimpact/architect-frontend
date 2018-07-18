import React, {Component} from "react";
import {Route} from "react-router-dom";
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