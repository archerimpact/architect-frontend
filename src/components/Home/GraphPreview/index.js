import React, {Component} from "react";
import { Link } from "react-router-dom";

import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/'
import * as graphActions from '../../../redux/actions/graphActions';

import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import './style.css';

class GraphPreview extends Component {

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
          this.props.dispatch(graphActions.addToGraphFromId(this.graph, neo4j_id));
        })
        .catch((err)=> {console.log(err)});
    }

    render() {
        return (
          <div className="graph-preview">
            <div className="graph-card">
              <Graph graph={this.graph} height={400} width={540} displayMinimap={false} allowKeycodes={false} data={this.state.data}/>
            </div>
            <div className="graph-preview-footer flex-row">
              <div className="graph-preview-share-icons">
                <i className="graph-preview-action twitter-action fab fa-twitter"></i>
                <i className="graph-preview-action link-action fas fa-link"></i>
              </div>
              <button className="btn btn-primary graph-preview-explore-button ml-auto">
                Explore In Depth
                <i className="explore-icon material-icons">launch</i>
              </button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphPreview));
