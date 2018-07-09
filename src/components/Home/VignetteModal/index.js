import React, {Component} from "react";
import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/';
import * as homeActions from '../../../redux/actions/homeActions';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import GraphPreview from '../GraphPreview';

import { Link } from "react-router-dom";

import './style.css'

class VignetteModal extends Component {


    constructor(props) {
      super(props);
      this.graph = new ArcherGraph();
      this.state = {
        data: {
          links: [],
          nodes: []
        }
      }

    }

    componentDidMount() {
      // this.graph.flushData();
      server.searchBackendText("Dan Gertler") // hardcoded for now, don't worry too much about it until we decide this way of doing the narratives is conceptually best
        .then((data) => {
          let neo4j_id = data[0].id
          this.props.dispatch(homeActions.addToVignetteFromId(this.graph, neo4j_id));
        })
        .catch((err)=> {console.log(err)});
    }

    onEntityClick = (string) => {
      // this.graph.flushData();
      var graph = this.graph;
      debugger;
      server.searchBackendText(string)
        .then((data) => {
          let neo4j_id = data[0].id
          this.props.dispatch(homeActions.addToVignetteFromId(graph, neo4j_id));
        })
        .catch((err)=> {console.log(err)})
    }

    render() {
        return (
          <div onClick={this.props.handleClick}>
            <ModalContainer onClose={this.props.handleClose}>
              <ModalDialog onClose={this.props.handleClose}>
                <div className="vignette-card">
              <div className="vignette-card-row flex-row">
                <div className="vignette-card-col vignette-card-left-col">
                  <div className="vignette-card-header">
                    <p className="vignette-date">July 9, 2018</p>
                    <h4 className="vignette-title">How A MINING MOGUL FUELS THE DRC CIVIL WAR</h4>
                    <p className="vignette-author">by Archer Team</p>  
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">
                    <p className="vignette-content">
                      <button onClick={() => {this.onEntityClick("Dan Gertler")}}>Dan Gertler</button>, sanctioned under the Global Magnitsky Executive Order of December 2017, is one of the primary targets of a recent move by the United States to combat those individuals and entities involved with serious human rights abuses and government corruption. Gertler maintains a strong presence in the Democratic Republic of the Congo as a key mining mogul, and notably as a close friend of President Joseph Kabila who remains in power years after the expiration date of his term. 
                    </p>
                    <p className="vignette-content">
                      Gertler’s <button onClick={() => {this.onEntityClick("Fleurette Properties Ltd")}}>Fleurette Properties Ltd</button>. encompasses over 60 holding companies, many with stakes in Congolese mining ventures. Several of these holding companies are contained in OFAC sanctions data, such as <button onClick={() => {this.onEntityClick("Lora Enterprises Limited")}}>Lora Enterprises Limited</button>, registered in the British Virgin Islands. This company was used by Gertler in multiple transactions, allowing him to remain a prominent stakeholder in Katanga Mining (thanks to a loan from mining giant Glencore that was uncovered by the Paradise Papers). Based on the statement of New York hedge fund Och-Ziff, Lora Enterprises also acted as the means for paying about $100 million in bribes to President Kabila.
                    </p>
                    <p className="vignette-content">
                      Accusations have been made against Gertler by the United Nations and the Africa Progress Panel claiming that he has in the past financed the purchase of weapons during the Congolese civil war and has been the been the cause of a lost $1.4 billion in revenue for the DRC (the consequence of an array of clandestine mining deals made at below-market value). As a result, Gertler, his business partner Pieter Albert Deboutte, and their network, containing over 30 entities, have found themselves under OFAC sanctions.
                    </p>
                  </div>
                </div>

                <div className="vignette-card-col vignette-card-right-col">
                  <div className="vignette-card-graph">
                    <GraphPreview />
                  </div>
                  <div className="vignette-card-footer flex-row">
                    <div className="vignette-share-icons">
                      <i className="vignette-action twitter-action fab fa-twitter"></i>
                      <i className="vignette-action link-action fas fa-link"></i>
                    </div>
                    <button className="btn btn-primary vignette-explore-button ml-auto">
                      Explore In Depth
                      <i className="explore-icon material-icons">launch</i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
              </ModalDialog>
            </ModalContainer>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VignetteModal));
