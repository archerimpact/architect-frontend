import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import SettingsModal from '../../settingsModal';
import HelpModal from '../../helpModal';
import { resetProjectDispatch } from '../../../redux/actions/graphActions';

import './style.css'

class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isSettingsModalOpen: false,
      isHelpModalOpen: false 
    };
  }

  handleClick = (isSettings) => this.setState(isSettings ? { isSettingsModalOpen: true } : { isHelpModalOpen: true });
  handleClose = (isSettings) => this.setState(isSettings ? { isSettingsModalOpen: false } : { isHelpModalOpen: false });
  toggleModal = (isSettings) => this.setState(isSettings ? { isSettingsModalOpen: !this.state.isSettingsModalOpen } : { isHelpModalOpen: !this.state.isHelpModalOpen });

  render() {
    return (
      <div className="side-nav unselectable">
        <ReactTooltip place="right" effect="solid"/>
        <Link to='/' onClick={() => { this.props.dispatch(resetProjectDispatch()); }}>
          <div className="side-nav-button" data-tip="Home">
            <i className="material-icons">home</i>
          </div>
        </Link>
        <Link to='/data'>
          <div className="side-nav-button" data-tip="Data">
            <i className="material-icons">data_usage</i>
          </div>
        </Link>
        <Link to='/build' onClick={() => { this.props.dispatch(resetProjectDispatch()); }}>
          <div className="side-nav-button" data-tip="Spaces">
            <i className="material-icons">dashboard</i>
          </div>
        </Link>
        <Link to='/user'>
          <div className="side-nav-button" data-tip="Account">
            <i className="material-icons">account_box</i>
          </div>
        </Link>
        <div className="bottom">
          <div className="side-nav-button" onClick={ this.toggleModal.bind(this, true) } data-tip="Settings">
            <i className="material-icons">settings</i>
          </div>
          <div className="side-nav-button" onClick={ this.toggleModal.bind(this, false) } data-tip="Help">
            <i className="material-icons">help</i>
          </div>
        </div>
        {
          this.state.isSettingsModalOpen && 
          <SettingsModal handleClick={ this.handleClick.bind(this, true) } handleClose={ this.handleClose.bind(this, true) } />
        }
        {
          this.state.isHelpModalOpen &&
          <HelpModal handleClick={ this.handleClick.bind(this, false) } handleClose={ this.handleClose.bind(this, false) } />
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
