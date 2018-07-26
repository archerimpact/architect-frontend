import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import SignUpForm from '../signUpForm';

import './style.css'

export default class BetaModal extends Component {
  render() {
    return (
      <div onClick={this.props.handleClick}>
        <ModalContainer onClose={this.props.handleClose}>
          <ModalDialog onClose={this.props.handleClose}>
            <div id="beta-modal-content" className="modal-content">
              <h3 className="modal-title text-center">Beta Access</h3>
              <p className="modal-p">
                This is just a small preview of what the full platform will be.
                With intuitive collaboration, document tagging, and crowdsourced verification, Archer provides powerful investigative tools.
              </p>

              <p className="modal-p">
                If you'd like to find out more, check out&nbsp;
                <a href="https://www.archerimpact.com" className="underlined-link">
                  our website
                </a>
                .
              </p>

              <p className="modal-p">
                Sign up to get early access to our beta!
              </p>

              <SignUpForm/>

            </div>
          </ModalDialog>
        </ModalContainer>
      </div>
    );
  }
}
