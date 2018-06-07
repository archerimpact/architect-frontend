import React, { Component } from 'react';

import './style.css'

import { withRouter, Link } from 'react-router-dom';

class SideNavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="side-nav">
        <Link to='/'>
          <div className="side-nav-button">
            <i className="material-icons">home</i>
          </div>
        </Link>
        <Link to='/'>
          <div className="side-nav-button">
            <i className="material-icons">data_usage</i>
          </div>
        </Link>
        <Link to='/'>
          <div className="side-nav-button">
            <i className="material-icons">dashboard</i>
          </div>
        </Link>
        <div className="bottom">
          <Link to='/'>
            <div className="side-nav-button">
              <i className="material-icons">account_box</i>
            </div>
          </Link>
          <Link to='/'>
            <div className="side-nav-button">
              <i className="material-icons">help</i>
            </div>
          </Link>
        </div>
      </div>
    );
  }
};

export default withRouter(SideNavBar);