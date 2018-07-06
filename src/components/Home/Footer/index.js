import React, {Component} from "react";
import { Link } from "react-router-dom";

import './style.css';

export default class Footer extends Component {

    render() {
        return (
          <div className="footer">
            <div className="container">
              <div className="footer-layout-container">

                <div className="archer-plug">
                  <div className="footer-logo">
                    <p>hi</p>
                  </div>

                  <div>
                    <p className="footer-tagline">
                      Powering data-driven investigations at a global scale.
                    </p>
                  </div>
                </div>

                <div className="social-media-links">
                  <p>yo</p>
                </div>

              </div>

            </div>
          </div>
        );
    }
}