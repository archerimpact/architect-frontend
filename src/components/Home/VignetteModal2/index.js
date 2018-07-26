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
                    <p className="vignette-date">July 12, 2018</p>
                    <h4 className="vignette-title">HOW sanctions data applies to finding oligarchs</h4>
                    {/*<p className="vignette-author">Treasury Press Release</p>  */}
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">
                    <p className="vignette-content">
                      Click on the highlighted entities in this text to expand the node.
                    </p>
                    <p className="vignette-content">
                      Russian Oligarch <button onClick={() => {this.onEntityClick("Oleg Deripaska")}}>Oleg Deripaska</button> was sanctioned on April 8, 2018 by US Treasury.
                    </p>
                    <p className="vignette-content">
                      Context: According to a <a href="https://home.treasury.gov/news/press-releases/sm0338">US Treasury press release</a>, “Deripaska has been investigated for money laundering, and has been accused of threatening the lives of business rivals, illegally wiretapping a government official, and taking part in extortion and racketeering.  There are also allegations that Deripaska bribed a government official, ordered the murder of a businessman, and had links to a Russian organized crime group.
                    </p>
                    <p className="vignette-content">
                      In the graph, you can see companies owned by Deripaska, including <button onClick={() => {this.onEntityClick("Russian Machines")}}>Russian Machines</button>, <button onClick={() => {this.onEntityClick("EN+ Group Plc")}}>EN+ Group Plc</button>, <button onClick={() => {this.onEntityClick("JSC Eurosibinergo")}}>JSC Eurosibinergo</button>, and <button onClick={() => {this.onEntityClick("Basic Element Limited")}}>Basic Element Limited</button>.                                                   
                    </p>
                    <p className="vignette-content">
                      Use the graph to discover another company in the network, <button onClick={() => {this.onEntityClick("United Company Rusal PLC")}}>United Company Rusal PLC</button>, owned by EN+ Group Plc.
                    </p>
                  </div>
                </div>

                <div className="vignette-card-col vignette-card-right-col">
                    <GraphPreview index={this.props.index} graph={this.graph} startingNode={"Oleg Deripaska"} noLink />
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
