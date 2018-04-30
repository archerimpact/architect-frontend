import React, { Component } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter } from 'react-router-dom';
import * as graphActions from './graphActions';
import * as actions from '../../../redux/actions';

import './graph.css'

const urlPropsQueryConfig = {
  /* type specifies the type of encoding necessary, queryParam sets which
    variable name to look for in this.props */ 

  search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
  entityid: { type: UrlQueryParamTypes.integer, queryParam: 'entityid'},
  graphid: { type: UrlQueryParamTypes.integer, queryParam: 'graphid'},
  centerid: { type: UrlQueryParamTypes.integer, queryParam: 'centerid'}
} 

class Graph extends Component {

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.investigationId) {
      this.props.actions.fetchProject(this.props.match.params.investigationId);
    }
    if (this.props.search != null ){
      if (this.props.graphid !== null && this.props.graphid !== undefined && this.props.graphid !== "undefined") {
        this.props.actions.fetchGraphFromId(this.props.graph, this.props.graphid);
      }
    }  
  }

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, this.props.width, this.props.height);
  }

  componentWillReceiveProps(nextprops){
    if (this.props.graphid !== nextprops.graphid && nextprops.graphid !== null) {
      this.props.actions.fetchGraphFromId(this.props.graph, nextprops.graphid);
    } else if (this.props.entityid != null && this.props.entityid !== nextprops.entityid) {
      this.props.graph.translateGraphAroundId(parseInt(nextprops.entityid, 10))
    }
  }

  render() {
    return( 
      <div>
        {this.props.project && !this.props.match.path === "/explore/:sidebarState?" ? <div> {this.props.project.name} </div> : null}
        <div id="graph-container" style={{"height": this.props.height + "px", "width": this.props.width + "px"}}></div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, ...graphActions}, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  let sidebarSize = state.data.sidebarVisible ? 500 : 0;
  return{
      height: window.innerHeight,
      width: Math.max(window.innerWidth - sidebarSize),
      project: state.data.currentProject
  };
}
export default addUrlProps({ urlPropsQueryConfig })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph)));
