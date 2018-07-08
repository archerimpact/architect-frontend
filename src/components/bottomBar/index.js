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
              <input className="bottombar-input form-control" type="text" placeholder="Email address" />
              <i className="bottombar-submit material-icons">check</i>
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
