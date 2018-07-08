import React, {Component} from "react";
import { Link } from "react-router-dom";

export default class GraphPreview extends Component {

    render() {
        return (
          <div className="footer">
            <div className="container">
              <div className="footer-layout-container">
                <img className="footer-logo" src="full-footer.png" />

                <div className="social-media-links-container">
                  <img className="social-icons" src="social-icons.png" />
                </div>

              </div>

            </div>
          </div>
        );
    }
}