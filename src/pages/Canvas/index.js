import React, { Component } from 'react';

import Graph from './Graph';
import ArcherGraph from './Graph/components/GraphClass';
import GraphSidebar from './GraphSidebar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../redux/actions';
import * as graphActions from './Graph/graphActions';

class Canvas extends Component {

  constructor(props) {
    super(props);
    console.log("this.props", this.props);
    this.graph = new ArcherGraph();
    this.baseUrl = '/build/' + (this.props.match.params ? this.props.match.params.investigationId : null);
  }

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.investigationId) {
      this.props.actions.fetchProject(this.props.match.params.investigationId);
    }
    if (this.props.currentNode != null) {
      this.props.history.push(this.baseUrl+'/entity/' + encodeURIComponent(this.props.currentNode.id))
    }
    if (this.props.match.params && this.props.match.params.sidebarState === 'search' && this.props.match.params.query != null) {
      this.props.actions.fetchSearchResults(this.props.match.params.query);

    } else if (this.props.match.params && this.props.match.params.sidebarState === 'entity') {
      this.props.actions.fetchEntity(decodeURIComponent(this.props.match.params.query));
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.currentNode !== null && this.props.currentNode !== nextprops.currentNode) {
      this.props.history.push(this.baseUrl+'/entity/'+encodeURIComponent(nextprops.currentNode.id))
    }
    if (this.props.location.pathname !== nextprops.location.pathname && nextprops.match.params) {
      // this.props.actions.fetchProject(nextprops.match.params.investigationId);
      let nextQuery = nextprops.match.params.query;
      if (nextprops.match.params.sidebarState === 'search') {
        if (nextQuery != null && this.props.match.params.query !== nextQuery) {
          this.props.actions.fetchSearchResults(nextQuery);
        }
      } else if (nextprops.match.params.sidebarState === 'entity') {
        if (nextQuery != null && this.props.match.params.query !== nextQuery) {
          this.props.actions.fetchEntity(decodeURIComponent(nextprops.match.params.query));
        }
      }
    }
  }

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
    sidebarVisible: state.graph.sidebarVisible,
    currentProject: state.graph.currentProject,
    currentNode: state.graph.currentNode,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Canvas));
