import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import BetaModal from '../BetaModal';
import HelpModal from '../helpModal';
import { resetGraphDispatch } from '../../redux/actions/graphActions';

import './style.css';
import archerLogoA from '../../images/archer-logo-a.png';

class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isBetaModalOpen: false,
      isHelpModalOpen: false 
    };
  }

  handleClick = (modalType) => this.setState(modalType ? { isHelpModalOpen: true } : { isBetaModalOpen: true });
  handleClose = (modalType) => this.setState(modalType ? { isHelpModalOpen: false } : { isBetaModalOpen: false });
  toggleModal = (modalType) => this.setState(modalType ? { isHelpModalOpen: !this.state.isHelpModalOpen } : { isBetaModalOpen: !this.state.isBetaModalOpen });

  render() {
    return (
      <div className="side-nav unselectable">
        <ReactTooltip place="right" effect="solid"/>
        <Link to='/' onClick={() => { this.props.dispatch(resetGraphDispatch()); }}>
          <div id='top-nav-button' className="side-nav-button">
            <img id="archer-a-icon" src={ archerLogoA }></img>
          </div>
        </Link>
        <div className="side-nav-button" data-tip="Sign up" onClick={ this.toggleBetaModal }>
          <i className="material-icons">person_add</i>
        </div>
        <div className="side-nav-button" onClick={ this.toggleModal } data-tip="Help">
          <i className="material-icons">help</i>
        </div>
        {
          this.state.isBetaModalOpen &&
          <BetaModal handleClick={ this.handleClick } handleClose={ this.handleClose } />
        }
        {
          this.state.isHelpModalOpen &&
          <HelpModal handleClick={ this.handleClick } handleClose={ this.handleClose } />
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
