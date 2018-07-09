import React, {Component} from "react";

import './style.css'

export default class VignettePreview extends Component {

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
          <div className="tint"></div>
          <div className="preview-summary-box">
            <p className="preview-summary-text">Investigating the corporate holdings of one shady Tyler Heintz.</p>
          </div>
          <img src="./graph-test.png" className="preview-image" />
        </div>
      </div>
    );
  }
}
