import React, {Component} from "react";
import VignettePreview from './VignettePreview';
import VignettePreview2 from './VignettePreview2';
import VignettePreview3 from './VignettePreview3';
import VignettePreview4 from './VignettePreview4';
import GraphPreview from './GraphPreview';
import Footer from './Footer';
import UnderlinedTextInput from './UnderlinedTextInput';
import SearchBar from '../searchBar';
import SearchBarDatabase from '../searchBarDatabase';
import SignUpForm from '../signUpForm';
import { loadLink } from "../../redux/actions/homeActions"
import { userLogOut } from '../../redux/actions/userActions';
import { Link, withRouter, Redirect } from "react-router-dom"
import {connect} from "react-redux";

import "./style.css";
import "../../App/montserrat.css";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkPresent: false
        }
    }

    componentWillMount() {
        const { match } = this.props;
        if (match.params.id) {
            let projId = match.params.id;
            if (projId != null && projId !== "explore") {
                this.props.dispatch(loadLink(projId));
                this.setState({linkPresent: true})
            }
        }
    }

    backToHome = () => {
        this.setState({linkPresent: false});
    };

    logOut = () => {
      this.props.dispatch(userLogOut());
    }

    render() {
        const { linkPresent } = this.state;

        return (
            <div>
                <div className="beta-section">
                    <div className="container">
                        <div className="sign-up-row flex-row">
                            <p className="sign-up-tagline">
                                This is just a teaser. Sign up below for more.
                            </p>
                        </div>
                    </div>
                </div>
                    <div id="top">
            <header className="main-header">
              <nav className="primary">
                <ul id="primary-navigation">
                  <li className="menu-item">
                    <button onClick={() => { this.logOut() }}>
                      Log out
                    </button>
                    {/*
                    <div className="search-holder">
                      <SearchBar isHomePage={true} />
                    </div> */}
                  </li>
                </ul>
              </nav>
              <div className="logo-header center-column">
                <span className="centered-image">
                  <a href="/">
                    <img className="logo-image" src="archer_viz.png" alt="" />
                  </a>
                </span>
                    <div className="search-holder">
                      <SearchBarDatabase homeSearchContainerId="home-search-container" homeSearchInputId="home-search-input" showSettings={false} isHomePage={true}/>
                    </div>
              </div>
            </header>
          </div>

          <div className="home-item">
            <div className="content-section treasury-release">
              <div className="container">
                <div className="content-title-section flex-row">
                  <div className="content-title-text">
                    The Latest
                  </div>

                  <Link to={'/explore/search'} className="btn btn-primary sign-up-button launch-platform-button">
                      Launch Platform!
                      <i className="launch-icon material-icons">launch</i>
                  </Link>
                </div>
                <hr className="content-title-underline" />
                <div className="content-preview-section">
                  <div className="release-preview-card">
                    <div className="row">
                      <div className="col-md-6">
                        <img src="./newnewgif.gif" id="top-left-image" />
                      </div>
                      <div className="col-md-6 release-preview-content">
                        <div className="release-preview-summary">
                          <p className="bold">
                            Welcome to ArcherViz, a bite-sized preview of a powerful platform.
                          </p>
                          <p>
                            Earlier this year, <a href="https://archerimpact.com" className="underlined-link">Archer</a> designed &amp; developed <a href="https://sanctionsexplorer.org/" className="underlined-link">SanctionsExplorer</a>.  Now, the Archer team has gone one step further, re-envisioning how our users interact with and derive insight from sanctions data.
                          </p>

                          <p id="sign-up">
                            ArcherViz applies our powerful analysis software to the OFAC SDN list.  With over 3,000 official entity relationships, this data begs to be interacted with in a network format. Experience a new way to investigate and share how your favorite sanctioned individuals, companies, and vessels are connected.
                          </p>

                          <p>
                            With easy publishing features, you can easily share and link your investigative work.
                          </p>
                        </div>

                        <div className="sign-up-container" id="subscribe">
                          <h4>There's more coming soon!</h4>
                          <p>
                              This is just a preview of how powerful graph visualization can be applied to <strong>your</strong> critical datasets.  Sign up to receive early access to our full beta.
                          </p>
                          <SignUpForm/>
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
                    Examples
                  </div>
                  <hr className="content-title-underline" />

                  <p className="content-title-summary lead">
                    Graph visualization can be a powerful tool for creating compelling narratives and conveying complex relationships.  Explore our featured case studies which illustrate the experience of supplementing text with a fully-interactive graph.
                  </p>

                  <div className="row">
                    <VignettePreview key={"vp1"} index={0} colorProfile='0' />
                    <VignettePreview2 key={"vp2"} index={1} colorProfile='1' />
                      {
                          linkPresent ?
                              <VignettePreview4 key={"vp4"} index={4} colorProfile='4' backToHome={this.backToHome} />
                              :
                              <VignettePreview3 key={"vp3"} index={2} colorProfile='2' />
                      }
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
                      The summer is in full swing and so are we.  We have an exciting set of releases slated for the next few weeks.  Don't want to miss out?  Catch us on <a href="https://twitter.com/archerimpact" className="real-link bold">Twitter</a> or <a href="#sign-up" className="real-link bold">subscribe</a> to our summer announcements. To learn more about what we do, check out our <a href="https://www.archerimpact.com/" className="real-link bold"> website</a>.
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

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

export default withRouter(connect(mapDispatchToProps)(Home));