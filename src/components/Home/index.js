import React, {Component} from "react";
import Vignette from './Vignette/';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';
import UnderlinedTextInput from './UnderlinedTextInput';

import "./style.css";
import "../../App/montserrat.css";

export default class Home extends Component {

    render() {
        return (
            <div>
                <div id="header">
                    <div className="container">
                        <div className="interactive-banner-logo-container">
                            <img className="interactive-banner-logo" src="logo.png" />
                            <h1 className="interactive-banner-sublogo">VIZ</h1>
                        </div>
                        <h3 className="interactive-banner-title">
                            Exploring insights derived from public sanctions data.
                        </h3>
                        <p className="interactive-banner-subtitle">
                            Featured stories showcasing the power of <span className="text-emphasis">graph visualizations</span> for narrative and analysis.
                        </p>
                    </div>
                </div>
                <ParticleBackground />

                <div className="beta-section">
                    <div className="container">
                        <div className="sign-up-row flex-row">
                            <p className="sign-up-tagline">
                                We're just getting started &mdash; sign up for beta access.
                            </p>
                            <div className="sign-up-formm">
                                <UnderlinedTextInput />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vignettes-section">
                    <div className="container">
                        <div className="vignette-holder">
                            <Vignette key={1}/>
                        </div>
                        <div className="vignette-holder">
                            <Vignette key={1}/>
                        </div>
                    </div>
                </div>

                <div id="find-out-more-section">
                    <h3>And there's so much more on the horizon.</h3>
                    <div className="container" id="find-out-container">
                        <p className="lead">
                            Harness the power of crowdsourced insight and effortless collaboration to supercharge your investigations.&nbsp;
                            <a id="main-website-link" href="https://archer.cloud">
                                Find out more >
                            </a>
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}