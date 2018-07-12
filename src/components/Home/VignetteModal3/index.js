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

class VignetteModal3 extends Component {


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
                    <h4 className="vignette-title">How sanctions data applies to nuclear non-proliferation</h4>
                    {/*<p className="vignette-author">by Archer Team</p>  */}
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">   
                    <p className="vignette-content">
                      Click on the highlighted entities in this text to expand the node.
                    </p>
                    <p className="vignette-content">
                      Sanctions data also reveals information and connections about people and companies that proliferate weapons of mass destruction, like nuclear missiles.
                    </p>           
                    <p className="vignette-content">
                      One example is the <button onClick={() => {this.onEntityClick("KOREA MINING DEVELOPMENT TRADING CORPORATION")}}>KOREA MINING DEVELOPMENT TRADING CORPORATION</button>. For context, a US Treasury press release states that “KOMID has offices in multiple countries around the world and aims to facilitate weapons sales.  TCB plays a role in financing KOMID's sales of ballistic missiles and has also been involved in ballistic missile transactions from KOMID to Iran's Shahid Hemmat Industrial Group (SHIG), the U.S. and UN-designated Iranian organization responsible for developing liquid-fueled ballistic missiles.”
                    </p>
                    <p className="vignette-content">
                      One example is the <button onClick={() => {this.onEntityClick("KOREA MINING DEVELOPMENT TRADING CORPORATION")}}>KOREA MINING DEVELOPMENT TRADING CORPORATION</button>. For context, a US Treasury press release states that “KOMID has offices in multiple countries around the world and aims to facilitate weapons sales.  TCB plays a role in financing KOMID's sales of ballistic missiles and has also been involved in ballistic missile transactions from KOMID to Iran's Shahid Hemmat Industrial Group (SHIG), the U.S. and UN-designated Iranian organization responsible for developing liquid-fueled ballistic missiles.”
                    </p>
                  </div>
                </div>

                <div className="vignette-card-col vignette-card-right-col">
                    <GraphPreview index={this.props.index} graph={this.graph} startingNode={"KOREA MINING DEVELOPMENT TRADING CORPORATION"}/>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VignetteModal3));
