import React, {Component} from "react";
import DatabaseSearchBar from "../databaseSearchBar";
import Canvas from "../Canvas";
import {Link, NavLink, withRouter} from "react-router-dom";

import "./style.css";
import logo from "../../images/architect-logo-light-transparent-cropped.png";
import decal from "../../images/decal-up-gradient-blue.png";
import decalFlipped from "../../images/decal-up-gradient-blue-flipped.png";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCoverHidden: false
        };
    }

    render() {
        return (
            <div className="home">
                <div className={ this.state.isCoverHidden ? "home-cover hidden" : "home-cover" }>
                    <nav className="transparent-navbar unselectable">
                        <div className="nav-item-container">
                            <NavLink className="nav-item" to="/wiki">
                                <span className="nav-text">WIKI</span>
                            </NavLink>
                            <NavLink className="nav-item" to="/applications">
                                <span className="nav-text">EXAMPLES</span>
                            </NavLink>
                            <NavLink className="nav-item" to="/about">
                                <span className="nav-text">ABOUT</span>
                            </NavLink>
                            <NavLink id="nav-item-login" className="nav-item" to="/login">
                                <span className="nav-text">LOGIN</span>
                            </NavLink>
                        </div>
                    </nav>
                    <div className="center unselectable">
                        <img className="logo" src={logo} alt="logo"></img>
                        <DatabaseSearchBar homeSearchContainerId="home-search-container" homeSearchInputId="home-search-input" showSettings={false}/>
                    </div>
                </div>
                <Canvas isCovered={!this.state.isCoverHidden} onMouseOver={this.hideCover.bind(this)} />
            </div>
        );
    }

    hideCover (e) {
        this.setState({ isCoverHidden: true });
        setTimeout(function() { this.props.history.push('/explore'); }.bind(this), 500);
    }
}
