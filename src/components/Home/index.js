import React, {Component} from "react";
import DatabaseSearchBar from "../databaseSearchBar";
import SideNavBar from "../sideNavBar";
import Vignette from './Vignette/';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';

import "./style.css";

export default class Home extends Component {

    render() {
        return (
            <div>
                <div id="interactive-banner">
                    <ParticleBackground />
                    <img className="interactive-banner-logo" src="logo.png" />
                    <h3 className="interactive-banner-title">
                        Exploring insights derived from public sanctions data.
                    </h3>
                    <p className="interactive-banner-subtitle">
                        Featured stories showcasing the power of graph visualizations for narrative and analysis.
                    </p>
                </div>

                <div className="beta-section">

                </div>

                <div className="vignettes-section">
                    <div className="vignettes">
                      <Vignette key={1}/>
                      <Vignette key={2}/>
                    </div>
                </div>

                <div className="find-out-more-section">

                </div>

                <Footer />
            </div>
        );
    }
}