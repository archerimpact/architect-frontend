import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.css'

export default class BottomBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
      submitted: false,
    };
    this.renderClose = this.renderClose.bind(this);
  }

  renderClose() {
      return (<i className="material-icons bottombar-close" onClick={() => this.setState({ hidden: true })}>close</i>)
  }


  render() {
    return (
      <div className={"bottombar " + (this.state.hidden ? "d-none" : "") }>
        { !this.state.submitted ? 
          (
            <div className="bottombar-content">
              { this.renderClose() }
              <p className="bottombar-text">
                We're just getting started &mdash; sign up to access the full platform!
              </p>

              

              <form className="modal-form" action="https://archeratberkeley.us17.list-manage.com/subscribe/post?u=6f7abb9e526fd4f56b65d0305&amp;id=8399a2fbfc" method="post" id="subForm" data-error="Please fill all fields correctly." data-success="Thanks for signing up! Please check your inbox for confirmation email.">
                <div className="flex-row bottom-email-row">
                  <input id="bottom-email-input" className="bottombar-input form-control" type="text" id="mce-EMAIL" name="EMAIL" type="email" placeholder="Email Address" required />
                  <button id="bottom-email-submit" className="btn btn-primary" type="submit" >
                    <i className="bottombar-submit material-icons">send</i>
                  </button>
                </div>
              </form>


            </div>
          )
          :
          (
            <div className="bottombar-content">
              { this.renderClose() }
              <p className="bottombar-text">
                Thanks! For more info, check out&nbsp;
                <a href="https://archer.cloud">
                  our website
                </a>
                .
              </p>
            </div>
          )
        }
      </div>
    );
  }
}
