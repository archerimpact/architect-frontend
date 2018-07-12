import React, {Component} from "react";
import {Route} from "react-router-dom";
import Home from "../components/Home/";
import Canvas from "../components/Canvas";
import SideNavbar from '../components/sideNavBar';

import "./style.css";

export default class App extends Component {
    render() {
        return (
          <div>
            <div className="main">
                <Route exact path="/:id?" component={Home}/>
                <Route path="/explore/:sidebarState?/:query?" component={Canvas}/>
            </div>
          </div>
        );
    }
}