import React, {Component} from "react";
import VignetteModal from './VignetteModal/';
import VignettePreview from './VignettePreview';
import GraphPreview from './GraphPreview';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';
import UnderlinedTextInput from './UnderlinedTextInput';
import SearchBar from '../searchBar'
import SearchBarDatabase from '../searchBarDatabase'

import "./style.css";
import "../../App/montserrat.css";

export default class Home extends Component {

    render() {
        return (
            <div>
                <div className="beta-section">
                    <div className="container">
                        <div className="sign-up-row flex-row">
                            <p className="sign-up-tagline">
                                From July 10 - August 7, we're releasing something new every Tuesday. Come back for more.
                            </p>
                            {/*
                            <div className="sign-up-formm">
                                <UnderlinedTextInput />
                            </div> */}
                        </div>
                    </div>
                </div>
                    <div id="top">
            <header className="main-header">
              <nav className="primary">
                <ul id="primary-navigation">
                  <li className="menu-item">
                    {/*
                    <div className="search-holder">
                      <SearchBar />
                    </div> */}
                  </li>
                </ul>
              </nav>
              <div className="logo-header center-column">
                <span className="centered-image">
                  <a href="/">
                    <img className="logo-image" src="logo.png" alt="" />
                  </a>
                </span>
                    <div className="search-holder">
                      <SearchBarDatabase homeSearchContainerId="home-search-container" homeSearchInputId="home-search-input" showSettings={false}/>

                    </div>
              </div>
              <div className="control">
      {/*}           <nav class="secondary">
                  <ul id="secondary-navigation">
                    <li class="menu-button">
                      <a>Archer Labs</a>
                    </li>
                    <li class="menu-button-secondary">
                      <a>Merch</a>
                    </li>
                  </ul>
                </nav> */}
              </div>
            </header>
          </div>
          {/*<div className="search-section">
            <div className="container">
              <div className="search-holder">
                <SearchBar />
              </div>
            </div>
          </div>*/}

          <div className="home-item">
            <div className="content-section treasury-release">
              <div className="container">
                <div className="content-title-section">
                  <div className="content-title-text">
                    What's New
                  </div>
                  <hr className="content-title-underline" />
                </div>
                <div className="content-preview-section">
                  <div className="release-preview-card"> 
                    <div className="row">
                      <div className="col-md-6">
                        <GraphPreview />
                      </div>
                      <div className="col-md-6 release-preview-content">
                        <h4 className="release-preview-header">
                          Specially Designated Nationals List
                        </h4>
                        <div className="release-preview-summary">
                          <p>
                            OFAC SDN data contains over 3,000 links. Explore how your favorite sanctioned individuals, companies, and vessels are connected.
                          </p>
                          <h5>Context</h5>
                          <p>
                            The U.S. Treasury publishes a list of individuals, entities, and vessels with whom American citizens and businesses cannot transact with.   This list is critical for investigations and compliance.
                          </p>
                        </div>

                        <div className="sign-up-container">
                          <h4>There's more coming soon!</h4>
                          <p>
                            This is just a preview of how powerful graph visualization can be applied to critical datasets.  Sign up to receive early access to our full beta release when it's ready.
                          </p>
                          <div className="sign-up-form-container">
                            <div className="sign-up-form">
                              <input className="sign-up-input" placeholder="Email address"/>
                            </div>
                            <button className="sign-up-button">
                              Sign up
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <div className="container">
                  <div className="content-title-text">
                    Featured Stories
                  </div>
                  <hr className="content-title-underline" />

                  <div className="row">
                    <VignettePreview key={"vp1"}/>
                    <VignettePreview key={"vp2"}/>
                    <VignettePreview key={"vp3"}/>
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
          </div>

          <Footer />
        </div>
        );
    }
}