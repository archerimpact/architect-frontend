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
    const params = new URLSearchParams(this.props.location.search);
    this.state = {
      search: params.get('search'),
      graphid: params.get('graphid')
    }
  }

  componentDidMount() {
    if (this.state.search !== null) {
      this.props.actions.fetchSearchResults(this.state.search);
    }

    // Set up graph and fetch if id given
    // if (this.state.graphid !== null) {
    //   this.props.actions.fetchGraphFromId(this.graph, this.state.graphid);
    // }

    // If in build fetch current investigation
    if (this.props.match.params && this.props.match.params.investigationId) {
      this.props.actions.fetchProject(this.props.match.params.investigationId);
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.location !== nextprops.location) {
      const nextParams = new URLSearchParams(nextprops.location.search);
      let nextSearch = nextParams.get('search');
      let nextGraphid = nextParams.get('graphid');
      if (nextSearch !== null && this.state.search !== nextSearch) {
        this.props.actions.fetchSearchResults(nextSearch);
        this.setState({ showResults: true })
      }

      if (this.state.graphid !== nextGraphid && nextGraphid !== null) {
        // this.props.actions.addToGraphFromId(this.graph, nextGraphid);
      }
      // } else if (this.props.entityid != null && this.props.entityid !== nextEntityid) {
      //   this.props.graph.translateGraphAroundId(parseInt(nextEntityid, 10))
      // }
      this.setState({search: nextSearch, graphid: nextGraphid})
    }
  }

  render() {
    return (
      <div className="canvas">
        <Graph graph={this.graph} graphid={this.state.graphid}/>
        <GraphSidebar graph={this.graph} search={this.state.search} graphid={this.state.graphid}/>
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
