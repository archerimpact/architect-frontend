import React, {Component} from "react";
import DatabaseSearchBar from "../databaseSearchBar";
import Canvas from "../Canvas";

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
                    <div className="center">
                        <img className="logo" src={logo} alt="logo"></img>
                        <DatabaseSearchBar homeSearchContainerId="home-search-container" homeSearchInputId="home-search-input" showSettings={false}/>
                    </div>
                    <div className="decal-container">
                        <img className="decal" src={decal} alt="decal"></img>
                        <img id="right-decal" className="decal" src={decalFlipped} alt="decal"></img>
                        <img id="right-decal" className="decal" src={decal} alt="decal"></img>
                    </div>
                </div>
                <Canvas isCovered={!this.state.isCoverHidden} onMouseOver={this.hideCover.bind(this)} />
            </div>
        );
    }

    hideCover (e) {
        this.setState({ isCoverHidden: true });
        setTimeout(function() { this.props.history.push('/explore'); }.bind(this), 1000);
    }
}
