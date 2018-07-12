import React, {Component} from "react";
import VignetteModal4 from "../VignetteModal4";
import {withRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";

import './style.css'

export default class VignettePreview4 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true,
      colorProfile: props.colorProfile,
    }
  }

  turnOffModal = () => this.setState({ isModalOpen: false });
  handleClick = () => this.setState({ isModalOpen: true });
  handleClose = () => {
      this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <div className="col-md">
        <div className="preview-title-content">
          <div className="flex-row">
            <p className="preview-date">July 9, 2018</p>
          </div>
          <h5 className="preview-title">Following Networks in South Sudan</h5>
          <hr className="preview-divider" />
        </div>
        <div className="col-md preview-box">
          <div className={"tint " + "tint-color-" + this.state.colorProfile} onClick={ this.turnOffModal }>
            <p className="preview-summary-text">View the network that violates human rights in south sudan.</p>
          </div>
          <img src="./graph-test.png" className="preview-image" />
        </div>
        {
          this.state.isModalOpen && 
          <VignetteModal4 handleClick={this.handleClick} handleClose={this.handleClose} index={this.props.index} />
        }
      </div>
    );
  }
}