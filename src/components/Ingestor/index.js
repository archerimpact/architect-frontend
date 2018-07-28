import React, {Component} from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import {connect} from "react-redux";
import Graph from "../Canvas/Graph";
import ArcherGraph from "../Canvas/Graph/package/GraphClass";
import DocumentDisplay from './documentDisplay';

import './style.css';

class Ingestor extends Component {
    constructor(props) {
        super(props);
        this.graph = new ArcherGraph();
        this.state = {
            width: window.innerWidth/2,
            height: window.innerHeight
        }
    }

    render() {
      const data = {nodes: [], links: []}
        return (
            <div className="ingest-container">
              <div className="ingest-container-graph">
                <Graph graph={this.graph} data={data} displayMinimap={false} width={this.state.width} height={this.state.height}/>
              </div>
              <div className="ingest-container-document">
                <DocumentDisplay />
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

export default withRouter(connect(mapDispatchToProps)(Ingestor));