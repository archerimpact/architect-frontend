import React, {Component} from "react";
import { Link } from "react-router-dom";

import './style.css';

export default class ActionSection extends Component {

    render() {
        return (
          <Link to="/build/5b19a2bbc2e0c920679dfbec">
            <div className='action-body'>
              <div className='action-inner'>
                Go to the graph sandbox to search OFAC data and explore your own networks.
              </div>
            </div>
          </Link>
        );
    }
}