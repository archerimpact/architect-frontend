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
          <div className="vignette-card-graph">
            <Graph graph={this.graph} height={400} width={1100} displayMinimap={false} allowKeycodes={false} data={this.state.data}/>
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
