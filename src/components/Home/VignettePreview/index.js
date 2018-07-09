import React, {Component} from "react";
import VignetteModal from "../VignetteModal";

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
            <p className="preview-author ml-auto">by Archer</p>
          </div>
          <h5 className="preview-title">How A MINING MOGUL FUELS THE DRC CIVIL WAR</h5>
          <hr className="preview-divider" />
        </div>
        <div className="col-md preview-box">
          <div className={"tint " + "tint-color-" + this.state.colorProfile} onClick={ this.toggleModal }>
            <p className="preview-summary-text">Investigating the corporate holdings of one shady Tyler Heintz.</p>
          </div>
          <img src="./graph-test.png" className="preview-image" />
        </div>
        {
          this.state.isModalOpen && 
          <VignetteModal handleClick={this.handleClick} handleClose={this.handleClose} />
        }
      </div>
    );
  }
}
