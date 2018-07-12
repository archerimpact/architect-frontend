import React, {Component} from "react";
import VignetteModal3 from "../VignetteModal3";

import './style.css'

export default class VignettePreview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      colorProfile: props.colorProfile,
    }
  }

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });
  handleClick = () => this.setState({ isModalOpen: true });
  handleClose = () => this.setState({ isModalOpen: false });

  render() {
    return (
      <div className="col-md">
        <div className="preview-title-content">
          <div className="flex-row">
            <p className="preview-date">July 9, 2018</p>
          </div>
          <h5 className="preview-title">How sanctions data applies to nuclear non-proliferation</h5>
          <hr className="preview-divider" />
        </div>
        <div className="col-md preview-box">
          <div className={"tint " + "tint-color-" + this.state.colorProfile} onClick={ this.toggleModal }>
            <p className="preview-summary-text">View the network of a north korean weapons company.</p>
          </div>
          <img src="./graph-test.png" className="preview-image" />
        </div>
        {
          this.state.isModalOpen && 
          <VignetteModal3 handleClick={this.handleClick} handleClose={this.handleClose} index={this.props.index} />
        }
      </div>
    );
  }
}
