import React, {Component} from "react";
import { Link } from "react-router-dom";

import './style.css';

export default class Footer extends Component {

    render() {
        return (
          <div className="footer">
            <div className="container">
              <div className="footer-layout-container">
                <a href="https://archerimpact.com">
                  <img className="footer-logo" src="full-footer.png" />
                </a>
                <div className="social-media-links-container">
                  <a href="https://twitter.com/archerimpact">
                    <i className="social-media-icon fab fa-twitter"></i>
                  </a>
                  <a href="https://medium.com/@archerimpact">
                    <i className="social-media-icon fab fa-medium-m"></i>
                  </a>
                  <a href="https://www.instagram.com/archerimpact/">
                    <i className="social-media-icon fab fa-instagram"></i>
                  </a>
                  <a href="https://www.facebook.com/archerimpact/">
                    <i className="social-media-icon fab fa-facebook-f"></i>
                  </a>
                  <a href="https://linkedin.com/company/archergroup/">
                    <i className="social-media-icon fab fa-linkedin-in"></i>
                  </a>
                  <a href="mailto:team@archerimpact.com">
                    <i className="social-media-icon far fa-envelope"></i>
                  </a>
                </div>

              </div>

            </div>
          </div>
        );
    }
}