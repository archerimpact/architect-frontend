import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PublishModal from '../publishModal';

import './style.css'

export default class PreviewButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });
  handleClick = () => this.setState({ isModalOpen: true });
  handleClose = () => this.setState({ isModalOpen: false });

  render() {
    const { graph } = this.props;
    return (
      <div className="btn btn-primary publish-button flex-row" onClick={this.toggleModal}>
        <i className="material-icons">share</i>
        <p className="mb-0">Share!</p>
        {
          this.state.isModalOpen && 
          <PublishModal handleClick={this.handleClick} handleClose={this.handleClose} graph={graph} />
        }
      </div>
    );
  }
}
