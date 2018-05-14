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
    this.graph = new ArcherGraph();
  }

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.investigationId) {
      this.props.actions.fetchProject(this.props.match.params.investigationId);
    }
    if (this.props.match.params && this.props.match.params.sidebarState === 'search' && this.props.match.params.query !== null) {
      this.props.actions.fetchSearchResults(this.props.match.params.query);
    } else if (this.props.match.params && this.props.match.params.sidebarState === 'entity') {
      this.props.actions.addToGraphFromId(this.graph, this.props.match.params.query);
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.location !== nextprops.location && nextprops.match.params) {
      if (this.props.match.params.sidebarState === 'search') {
        let nextSearch = nextprops.match.params.query;
        if (nextSearch !== null && this.props.match.params.query !== nextSearch) {
          this.props.actions.fetchSearchResults(nextSearch);
        }
      } else if (this.props.match.params.sidebarState === 'entity') {
        this.props.actions.addToGraphFromId(this.graph, nextprops.match.params.query);
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
    sidebarVisible: state.data.sidebarVisible,
    currentProject: state.data.currentProject
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Canvas));
