import React, {Component} from "react";
import {Route} from "react-router-dom";
import Canvas from "../components/Canvas";

import "./style.css";

export default class App extends Component {
    render() {
        return (
          <div>
            <div className="main">
                <Route path="/explore/:sidebarState?/:query?" component={Canvas}/>
            </div>
          </div>
        );
    }
}