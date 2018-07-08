import React, {Component} from "react";
import DatabaseSearchBar from "../databaseSearchBar";
import SideNavBar from "../sideNavBar";
import Vignette from './Vignette/';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';
import UnderlinedTextInput from './UnderlinedTextInput';
import SearchBar from '../searchBar'

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
                                We're just getting started &mdash; sign up for beta access.
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
                    <div className="search-holder">
                      <SearchBar />
                    </div>
                  </li>
                </ul>
              </nav>
              <span className="logo-header">
                <a href="/">
                  <img className="logo-image" src="logo.png" alt="" />
                </a>
              </span>
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

          <div className="content-section">
            <div className="content-container">
              <div className="content-title-section">
              </div>
              <div className="content-preview-section">
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

                <div className="find-out-more-section">

                </div>

                <Footer />
            </div>
        );
    }
}