import React, { Component } from 'react';

import Graph from './Graph';
import ArcherGraph from './Graph/components/GraphClass';
import GraphSidebar from './graphSidebar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../redux/actions/projectActions';
import { fetchProject } from '../../redux/actions/projectActions';
import { fetchEntity, fetchSearchResults } from '../../redux/actions/graphActions';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new ArcherGraph();
    this.baseUrl = '/build/' + (this.props.match.params ? this.props.match.params.investigationId : null);
  }

  async componentWillMount() {
    if (this.props.match.params && this.props.match.params.investigationId) {
      await this.props.dispatch(fetchProject(this.props.match.params.investigationId));
    }
    if (this.props.match.params && this.props.match.params.sidebarState === 'search' && this.props.match.params.query !== null) {
      await this.props.dispatch(fetchSearchResults(this.props.match.params.query));

    } else if (this.props.match.params && this.props.match.params.sidebarState === 'entity') {
      await this.props.dispatch(fetchEntity(decodeURIComponent(this.props.match.params.query)));
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.currentNode !== null && this.props.currentNode !== nextprops.currentNode) {
      this.props.history.push(this.baseUrl+'/entity/' + encodeURIComponent(nextprops.currentNode.id))
    }
    if (this.props.location.pathname !== nextprops.location.pathname && nextprops.match.params) {
      // this.props.actions.fetchProject(nextprops.match.params.investigationId);
      let nextQuery = nextprops.match.params.query;
      if (nextprops.match.params.sidebarState === 'search') {
        if (nextQuery !== null && this.props.match.params.query !== nextQuery) {
          this.props.dispatch(fetchSearchResults(nextQuery));
        }
      } else if (nextprops.match.params.sidebarState === 'entity') {
        if (nextQuery !== null && this.props.match.params.query !== nextQuery) {
          this.props.dispatch(fetchEntity(decodeURIComponent(nextprops.match.params.query)));
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
    actions: bindActionCreators({ ...actions}, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state) {
  return {
    sidebarVisible: state.graph.sidebarVisible,
    currentProject: state.project.currentProject,
    currentNode: state.graph.currentNode,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Canvas));
