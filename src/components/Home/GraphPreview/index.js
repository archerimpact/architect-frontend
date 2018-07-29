import React, {Component} from "react";
import { Link } from "react-router-dom";
import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/'
import * as homeActions from '../../../redux/actions/homeActions';

import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {loadData} from "../../../redux/actions/graphActions";
import Script from 'react-load-script';

import './style.css';

class GraphPreview extends Component {

    constructor(props) {
      super(props);
      if (this.props.graph) { this.graph = this.props.graph; } 
      else { this.graph = new ArcherGraph(); }
    }

    componentDidMount() {
        if (this.props.startingNode) {
            server.searchBackendText(this.props.startingNode) // hardcoded for now, don't worry too much about it until we decide this way of doing the narratives is conceptually best
                .then((data) => {
                    let neo4j_id = data[0].id;
                    this.props.dispatch(homeActions.addToVignetteFromId(this.graph, neo4j_id, this.props.index));
                })
                .catch((err)=> {console.log(err)});
        }
    }

    loadDataToMainGraph = () => {
        this.props.dispatch(loadData(this.props.vignetteGraphData[this.props.index]))
    };

    renderGraph = () => {
      return (
        <Graph 
          graph={this.graph} 
          displayMinimap={false} 
          data={this.props.vignetteGraphData[this.props.index]} 
          index={this.props.index} 
        />  
      );
    };

    render() {
        return (
          <div className="graph-preview" >
            <Script url="https://platform.twitter.com/widgets.js" />
            <div className="graph-card" ref="graphPreviewBox">
              { this.renderGraph() }
            </div>
            <div className="graph-preview-footer flex-row">
              <div className="graph-preview-share-icons">
                <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`${ this.props.title ? '"' + this.props.title + '" - Try out an interactive way to experience case studies like this' : 'Try out an interactive way to experience case studies' } (and explore your favorite sanctioned networks!) on #ArcherViz @archerimpact ${ this.props.id ? 'https://viz.archerimpact.com/' + this.props.id : 'https://viz.archerimpact.com'}`)} >
                  <i className="graph-preview-action twitter-action fab fa-twitter"></i>
                </a>
                { this.props.noLink ? 
                  null
                  :
                  <i className="graph-preview-action link-action fas fa-link"></i>
                }
              </div>
              <div className="ml-auto">
                <Link to="/explore/list">
                    <button className="btn btn-primary graph-preview-explore-button" onClick={() => this.loadDataToMainGraph()}>
                        View in Platform
                        <i className="explore-icon material-icons">launch</i>
                    </button>
                </Link>
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
        vignetteGraphData: state.home.vignetteGraphData
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphPreview));
