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
                    <p className="vignette-author">Treasury Press Release</p>  
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">
                    <p className="vignette-content">
                      "Oleg Deripaska is being designated pursuant to E.O. 13661 for having acted or purported to act for or on behalf of, directly or indirectly, a senior official of the Government of the Russian Federation, as well as pursuant to E.O. 13662 for operating in the energy sector of the Russian Federation economy.  Deripaska has said that he does not separate himself from the Russian state.  He has also acknowledged possessing a Russian diplomatic passport, and claims to have represented the Russian government in other countries.  Deripaska has been investigated for money laundering, and has been accused of threatening the lives of business rivals, illegally wiretapping a government official, and taking part in extortion and racketeering.  There are also allegations that Deripaska bribed a government official, ordered the murder of a businessman, and had links to a Russian organized crime group."                    </p>
                    <p className="vignette-content">
B-Finance Ltd., based in the British Virgin Islands, is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska.
                    <p className="vignette-content">
Basic Element Limited is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska.  Basic Element Limited is based in Jersey and is the private investment and management company for Deripaska’s various business interests.
                    </p>
                      <p className="vignette-content">
EN+ Group is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska, B-Finance Ltd., and Basic Element Limited.  EN+ Group is located in Jersey and is a leading international vertically integrated aluminum and power producer.
                    </p>
                      <p className="vignette-content">
EuroSibEnergo is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and EN+ Group. EuroSibEnergo is one of the largest independent power companies in Russia, operating power plants across Russia and producing around nine percent of Russia’s total electricity.
                    </p>
                      <p className="vignette-content">
United Company RUSAL PLC is being designated for being owned or controlled by, directly or indirectly, EN+ Group.  United Company RUSAL PLC is based in Jersey and is one of the world’s largest aluminum producers, responsible for seven percent of global aluminum production.
                    </p>
                      <p className="vignette-content">
Russian Machines is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and Basic Element Limited.  Russian Machines was established to manage the machinery assets of Basic Element Limited.
                    </p>
                      <p className="vignette-content">
GAZ Group is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and Russian Machines.  GAZ Group is Russia’s leading manufacturer of commercial vehicles.
                    </p>
                      <p className="vignette-content">
Agroholding Kuban, located in Russia, is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and Basic Element Limited.                    </p>
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
