import React, { Component } from 'react';

import Graph from './Graph';
import ArcherGraph from './Graph/components/GraphClass';
import GraphSidebar from './GraphSidebar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../redux/actions';
import * as graphActions from './Graph/graphActions';
import * as server from '../../server/';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new ArcherGraph();
  }

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.investigationId) {
      this.props.actions.fetchProject(this.props.match.params.investigationId);
    }
    if (this.props.match.params && this.props.match.params.sidebarState === 'search' && this.props.match.params.query !== null) {
      this.props.actions.fetchSearchResults(this.props.match.params.query);
    } else if (this.props.match.params && this.props.match.params.sidebarState === 'entity') {
      // this.props.actions.addToGraphFromId(this.graph, this.props.match.params.query);
      // let entity = this.props.match.params.query;
      // if (entity != null) {
      //   // this.loadData(entity);
      // }
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.location.pathname !== nextprops.location.pathname && nextprops.match.params) {
      this.props.actions.fetchProject(nextprops.match.params.investigationId);
      if (this.props.match.params.sidebarState === 'search') {
        let nextSearch = nextprops.match.params.query;
        if (nextSearch !== null && this.props.match.params.query !== nextSearch) {
          this.props.actions.fetchSearchResults(nextSearch);
        }
      } else if (this.props.match.params.sidebarState === 'entity') {
        // this.props.actions.addToGraphFromId(this.graph, nextprops.match.params.query);
        // let entity = nextprops.match.params.query;
        // if (entity != null) {
        //   // this.loadData(entity);
        // }
      } 
    }
  }

  // loadData(neo4j_id) {
  //   server.getBackendNode(neo4j_id)
  //     .then(data => {
  //       //returns items in the format: [neo4j_data]
  //       this.setState({ nodeData: data[0] })
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  //   server.getBackendRelationships(neo4j_id)
  //     .then(data => {
  //       /* neo4j returns items in this format: [connection, startNode, endNode] */

  //       this.setState({ relationshipData: data })
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }


  render() {
    return (
      <div className="canvas">
        <Graph graph={this.graph}/>
        <GraphSidebar graph={this.graph}/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, ...graphActions}, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  return {
    sidebarVisible: state.data.sidebarVisible,
    currentProject: state.data.currentProject
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Canvas));
