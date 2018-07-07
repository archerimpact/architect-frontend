import React, {Component} from "react";
import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/'
import * as graphActions from '../../../redux/actions/graphActions'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import { Link } from "react-router-dom";

import './style.css'

class Vignette extends Component {

    render() {
        return (
          <div className="vignette-card">
            <div className="vignette-card-row flex-row">
              <div className="vignette-card-col vignette-card-left-col">
                <div className="vignette-card-header">
                  <h6 className="vignette-date">published July 6, 2018</h6>
                  <h4 className="vignette-title">How to Evade OFAC Sanctions</h4>
                  <h6 className="vignette-author">by Archer Team</h6>
                  <hr className="vignette-divider" />
                </div>

                <div className="vignette-card-left-col-body">
                  <p className="vignette-content">
                    Dan Gertler, sanctioned under the Global Magnitsky Executive Order of December 2017, is one of the primary targets of a recent move by the United States to combat those individuals and entities involved with serious human rights abuses and government corruption. Gertler maintains a strong presence in the Democratic Republic of the Congo as a key mining mogul, and notably as a close friend of President Joseph Kabila who remains in power years after the expiration date of his term. 
                  </p>
                  <p className="vignette-content">
                    Gertler’s Fleurette Properties Ltd. encompasses over 60 holding companies, many with stakes in Congolese mining ventures. Several of these holding companies are contained in OFAC sanctions data, such as Lora Enterprises Limited, registered in the British Virgin Islands. This company was used by Gertler in multiple transactions, allowing him to remain a prominent stakeholder in Katanga Mining (thanks to a loan from mining giant Glencore that was uncovered by the Paradise Papers). Based on the statement of New York hedge fund Och-Ziff, Lora Enterprises also acted as the means for paying about $100 million in bribes to President Kabila.
                  </p>
                  <p className="vignette-content">
                    Accusations have been made against Gertler by the United Nations and the Africa Progress Panel claiming that he has in the past financed the purchase of weapons during the Congolese civil war and has been the been the cause of a lost $1.4 billion in revenue for the DRC (the consequence of an array of clandestine mining deals made at below-market value). As a result, Gertler, his business partner Pieter Albert Deboutte, and their network, containing over 30 entities, have found themselves under OFAC sanctions.
                  </p>
                </div>
              </div>

              <div className="vignette-card-col vignette-card-right-col">

              </div>
            </div>
          </div>
        );
    }
    
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Vignette));
