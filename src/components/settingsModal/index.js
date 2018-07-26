import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

import './style.css'

class SettingsModal extends Component {
  render() {
    return (
      <div onClick={this.props.handleClick}>
        <ModalContainer onClose={this.props.handleClose}>
          <ModalDialog onClose={this.props.handleClose}>
            <div className="modal-content">
              <h1>Graph settings</h1>
              <div className="settings-entry">
                <input type="checkbox" id="toggle-minimap" onChange={() => {}} checked />
                <label htmlFor="toggle-minimap">Show minimap</label>
              </div>
            </div>
          </ModalDialog>
        </ModalContainer>
      </div>
    );
  }
}

function handleToggleMinimap() {

}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

export default withRouter(connect(mapDispatchToProps)(SettingsModal));
