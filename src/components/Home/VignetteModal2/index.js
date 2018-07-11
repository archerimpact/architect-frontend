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

class VignetteModal2 extends Component {


    constructor(props) {
      super(props);
      this.graph = new ArcherGraph();
    }

    onEntityClick = (string) => {
      // this.graph.flushData();
      var graph = this.graph;
      server.searchBackendText(string)
        .then((data) => {
          let neo4j_id = data[0].id
          this.props.dispatch(homeActions.addToVignetteFromId(graph, neo4j_id, this.props.index));
        })
        .catch((err)=> {console.log(err)})
    };

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
                    <h4 className="vignette-title">HOW TO FOLLOW THE OLIGARCH MONEY TRAIL</h4>
                    <p className="vignette-author">by Archer Team</p>  
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">
                    <p className="vignette-content">
                      Pursuant to Executive Order 13661 and 13662, Russian oligarch <button onClick={() => {this.onEntityClick("Oleg Deripasks")}}>Oleg Deripaska</button> has found himself and eight of his companies under U.S. sanctions. The U.S. Department of the Treasury cites Deripaska’s close ties to the Russian state, as well as accusations against the tycoon of money laundering, threatening business rivals, illegal wiretapping, extortion and racketeering, bribing government officials, ordering the murder of a businessman, and having connections to Russian organized crime. Additionally, Deripaska was a client of Paul Manafort, former campaign chairman for U.S. President Donald Trump. 
                    </p>
                    <p className="vignette-content">
                      Deripaska is also connected to Valery Pechenkin, a former high-ranking KGB and FSB official who was recently promoted from Deputy Chief Executive Officer of Security to Director General of Deripaska’s group Basic Element Limited. Sources in Moscow claim that Pechenkin helped to orchestrate meetings between then EU Trade Commissioner Peter Mandelson and Deripaska. These meetings expose an important conflict of interest, as Mandelson was involved in multiple decisions related to EU import tariffs that benefitted Deripaska’s aluminum business.
                    </p>
                    <p className="vignette-content">
                      In an effort to evade sanctions, EN+ Group PLC has announced that Deripaska will reduce his shareholding in the company to below 50 percent. EN+ also maintains a stake in several other companies hit by the Executive Orders, including JSC Eurosibenergo and United Company Rusal PLC. In 2013, a subsidiary of Rusal came under scrutiny by Russia’s Investigative Committee for more than $6 million in tax evasion. Despite this internal investigation, the U.S. Treasury has announced that sanctions relief for Rusal and its subsidiaries would be possible if Deripaska were to divest. 
                    </p>
                  </div>
                </div>

                <div className="vignette-card-col vignette-card-right-col">
                    <GraphPreview index={this.props.index} graph={this.graph} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VignetteModal2));
