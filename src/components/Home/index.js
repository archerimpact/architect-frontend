import React, {Component} from "react";
import VignettePreview from './VignettePreview';
import VignettePreview2 from './VignettePreview2';
import VignettePreview3 from './VignettePreview3';
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
            </header>
          </div>

          <div className="home-item">
            <div className="content-section treasury-release">
              <div className="container">
                <div className="content-title-section">
                  <div className="content-title-text">
                    The Latest
                  </div>
                  <hr className="content-title-underline" />
                </div>
                <div className="content-preview-section">
                  <div className="release-preview-card"> 
                    <div className="row">
                      <div className="col-md-6">
                        <GraphPreview index={3}/>
                      </div>
                      <div className="col-md-6 release-preview-content">
                        <div className="release-preview-summary">
                          <p>
                            Earlier this year, Archer designed &amp; developed <a href="https://sanctionsexplorer.org/">SanctionsExplorer</a>, releasing it in April in partnership with C4ADS.  Now, the Archer team has gone one step further,  re-envisioning how our users interact with and derive insight from sanctions data.
                          </p>
                          <p className="bold">
                          Welcome to ArcherSpark, a bite-sized preview of a powerful investigative platform.
                          </p>
                          <p id="sign-up">
                            ArcherSpark applies our powerful investigative tool to the OFAC SDN list.  With over 3,000 official links, this data begs to be interacted with in a graph format. Experience a new way to investigate and share how your favorite sanctioned individuals, companies, and vessels are connected.
                          </p>
                        </div>

                        <div className="sign-up-container" id="subscribe">
                          <h4>There's more coming soon!</h4>
                          <p>
                            This is just a preview of how powerful graph visualization can be applied to critical datasets.  Sign up to receive early access to our full beta release when it's ready.
                          </p>
                          <form className="sign-up-form sign-up-container" action="https://archeratberkeley.us17.list-manage.com/subscribe/post?u=6f7abb9e526fd4f56b65d0305&amp;id=8399a2fbfc" method="post" id="subForm" data-error="Please fill all fields correctly." data-success="Thanks for signing up! Please check your inbox for confirmation email.">
                            <input className="sign-up-input form-control validate-email" id="mce-EMAIL" name="EMAIL" type="email" placeholder="Email Address" required />
                            <button type="submit" className="btn sign-up-button">
                              Subscribe Now
                            </button>
                          </form>
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
                    Case Studies
                  </div>
                  <hr className="content-title-underline" />

                  <p className="content-title-summary lead">
                    Graph visualization can be a powerful tool for creating compelling narratives and conveying complex relationships.  Explore our featured case studies which illustrate the experience of supplementing text with a fully-interactive graph. 
                  </p>

                  <div className="row">
                    <VignettePreview key={"vp1"} index={0} colorProfile='0' />
                    <VignettePreview2 key={"vp2"} index={1} colorProfile='1' />
                    <VignettePreview3 key={"vp3"} index={2} colorProfile='2' />
                  </div>

              </div>
            </div>

            <div className="content-section" id="find-out-more-section">
              <div className="container" id="find-out-container">
                <div className="content-title-text text-center">
                  Just the beginning.
                </div>
                
                <div className="find-out-more-row flex-row">
                  <i className="beginning-icon material-icons">date_range</i>
                  <div>
                    <p className="content-title-summary lead">
                      The summer is in full swing and so are we.  We have an exciting set of releases slated for the next few weeks.  Don't want to miss out?  Catch us on <a href="https://twitter.com/archerimpact" className="real-link bold">Twitter</a> or <a href="#sign-up" className="real-link bold">subscribe</a> to our summer announcements. To learn more about what we do, check out our <a href="http://archer.cloud/" className="real-link bold"> website</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <Footer />
      </div>
        );
    }
}