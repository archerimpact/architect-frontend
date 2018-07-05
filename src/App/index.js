import React, {Component} from "react";
import {Route} from "react-router-dom";
import Home from "../components/Home/";
import Canvas from "../components/Canvas";
import "./style.css";

export default class App extends Component {
    render() {
        return (
            <div className="main">
                <Route exact path="/" component={Home}/>
                <Route path="/explore/:sidebarState?/:query?" component={Canvas}/>
            </div>
        );
    }
}