import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as graphActions from './graphActions';

import './graph.css';
import './style.css';

class Graph extends Component {

  constructor(props) {
    super(props);
    this.renderProjectToolbar = this.renderProjectToolbar.bind(this);
    this.expandNodeFromData = this.expandNodeFromData.bind(this);
    this.setCurrentNode = this.setCurrentNode.bind(this);
    this.saveCurrentProjectData = this.saveCurrentProjectData.bind(this);
  }

  setCurrentNode(d) {
    this.props.actions.setCurrentNode(d);
  }

  expandNodeFromData(d) {
    this.props.actions.addToGraphFromId(this.props.graph, d.id);
  }

  saveCurrentProjectData() {
    this.props.actions.saveCurrentProjectData(this.props.graph);
  }

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, this.props.width, this.props.height);
    if (this.props.graphData != null) {
      this.props.graph.bindDisplayFunctions({ expand: this.expandNodeFromData, node: this.setCurrentNode, save: this.saveCurrentProjectData });
      const graphData = { nodes: this.props.graphData.nodes, links: this.props.graphData.links };
      this.props.graph.setData(graphData.centerid, this.makeDeepCopy(graphData.nodes), this.makeDeepCopy(graphData.links));      
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.graphData != null && nextprops.project && nextprops.project._id != this.props.project._id) {
      this.props.graph.bindDisplayFunctions({ expand: this.expandNodeFromData, node: this.setCurrentNode, save: this.saveCurrentProjectData });
      const graphData = { nodes: nextprops.graphData.nodes, links: nextprops.graphData.links };
      this.props.graph.setData(graphData.centerid, this.makeDeepCopy(graphData.nodes), this.makeDeepCopy(graphData.links));
    }
  }

  makeDeepCopy(array) {
    var newArray = [];
    array.map((object) => {
      return newArray.push(Object.assign({}, object));
    });
    return newArray;
  }

  renderProjectToolbar() {
    return (
      <div className="back-button" onClick={() => {
        this.props.dispatch(graphActions.resetProject())
        this.props.history.push('/build')}
      }>
        <i className="material-icons back-button-icon">home</i>
      </div>
    )
  }
  
  render() {
    return( 
      <div>
        {this.props.project && this.props.match.path !== "/explore/:sidebarState?" ? this.renderProjectToolbar() : 
          null
        }
        <div id="graph-container" style={{"height": this.props.height + "px", "width": this.props.width + "px"}}></div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphActions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  let sidebarSize = state.data.sidebarVisible ? 600 : 0;
  let graphData = null
  if (state.data.currentProject != null && state.data.currentProject.graphData != null) {
    // TODO this is called a lot
    graphData = state.data.currentProject.graphData
  }
  return {
      height: window.innerHeight,
      width: Math.max(window.innerWidth - sidebarSize),
      project: state.data.currentProject,
      graphData: graphData
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph));
