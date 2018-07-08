import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import HelpModal from '../../helpModal';
import { resetProjectDispatch } from '../../../redux/actions/graphActions';

import './style.css'

class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { isHelpModalOpen: false };
  }

  handleClick = () => this.setState({ isHelpModalOpen: true });
  handleClose = () => this.setState({ isHelpModalOpen: false });
  toggleModal = () => this.setState({ isHelpModalOpen: !this.state.isHelpModalOpen });

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
          <Link to='/settings'>
            <div className="side-nav-button" data-tip="Settings">
              <i className="material-icons">settings</i>
            </div>
          </Link>
          <div className="side-nav-button" onClick={this.toggleModal} data-tip="Help">
            <i className="material-icons">help</i>
          </div>
        </div>
        {
          this.state.isHelpModalOpen &&
          <HelpModal handleClick={this.handleClick} handleClose={this.handleClose} />
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
