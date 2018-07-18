import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import BetaModal from '../BetaModal';
import HelpModal from '../helpModal';
import TermsModal from '../termsModal';
import { resetGraphDispatch } from '../../redux/actions/graphActions';

import './style.css';
import archerLogoA from '../../images/archer-logo-a.png';

class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isHelpModalOpen: false
    };
  }

  handleBetaClick = () => this.setState({ isBetaModalOpen: true });
  handleBetaClose = () => this.setState({ isBetaModalOpen: false });

  toggleHelpModal = () => this.setState({ isHelpModalOpen: !this.state.isHelpModalOpen });
  handleHelpClick = () => this.setState({ isHelpModalOpen: true });
  handleHelpClose = () => this.setState({ isHelpModalOpen: false });

  toggleTermsModal = () => this.setState({ isTermsModalOpen: !this.state.isTermsModalOpen });
  handleTermsClick = () => this.setState({ isTermsModalOpen: true });
  handleTermsClose = () => this.setState({ isTermsModalOpen: false });

  render() {
    return (
      <div className="side-nav unselectable">
        <ReactTooltip place="right" effect="solid"/>
        <Link to='/' onClick={() => { this.props.dispatch(resetGraphDispatch()); }}>
          <div id='top-nav-button' className="side-nav-button">
            <img id="archer-a-icon" src={ archerLogoA }></img>
          </div>
        </Link>
        <div className="side-nav-button" onClick={ this.toggleHelpModal } data-tip="Graph Help">
          <i className="material-icons">help</i>
        </div>
        <div className="side-nav-button mt-auto" onClick={ this.toggleTermsModal } data-tip="Terms and Conditions">
          <i className="material-icons">file_copy</i>
        </div>
        {
          this.state.isHelpModalOpen &&
          <HelpModal handleClick={ this.handleHelpClick } handleClose={ this.handleHelpClose } />
        }
        {
          this.state.isTermsModalOpen &&
          <TermsModal handleClick={ this.handleTermsClick } handleClose={ this.handleTermsClose } />
        }
      </div>
    )
  }
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

export default withRouter(connect(mapDispatchToProps)(SideNavBar));
