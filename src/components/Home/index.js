import React, {Component} from "react";
import Vignette from './Vignette/';
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
                    Latest Dataset Release
                  </div>
                </div>
                <div className="content-preview-section">
                  <div className="release-preview-card"> 
                    <div className="release-preview-header">
                      US Treasury Sanctions Data 
                    </div>
                    <div className="release-preview-summary">
                      US Treasury Sanctions data contains over 3,000 links. Explore how your favorite sanctioned individuals, companies, and vessels are connected.
                    </div>
                  </div>
                  <GraphPreview />
                </div>
              </div>
            </div>

            <div className="welcome-to-archer-section">
           
              <div className="container">
                <div className="content-title-section">
                  <div className="content-title-text">
                    Welcome to Archer, where doing matters.
                  </div>
                <div className="content-preview-section">
                  <div className="release-preview-card"> 
                    <div className="release-preview-header">
                      We'll keep you updated about our upcoming product releases and analytical tools.
                    </div>
                    <div className="sign-up-form-container">

                      <div className="sign-up-form">
                        <input className="sign-up-input">
                        </input>
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
            <div className="content-section">
              <div className="container">
                <div className="content-title-section">
                  <div className="content-title-text">
                    See what people are doing with the graph
                  </div>
                </div>
                <div className="content-preview-section">
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
          </div>

                <Footer />
            </div>
        );
    }
}