import React, { Component } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter } from 'react-router-dom';
import * as actions from './graphActions';

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

  constructor(props) {
    super(props);
    let sidebarSize = props.sidebarVisible ? 500 : 0;
    debugger
    this.state = {
      height: window.innerHeight,
      width: Math.max(window.innerWidth - sidebarSize)
    }
  }

  componentWillMount() {
    if (this.props.search != null ){
      if (this.props.graphid !== null && this.props.graphid !== undefined) {
        this.props.actions.fetchGraphFromId(this.props.graph, this.props.graphid);
      }
    }  
  }

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, this.state.width, this.state.height);
  }

  componentWillReceiveProps(nextprops){
    if (this.props.graphid !== nextprops.graphid) {
      this.props.actions.fetchGraphFromId(this.props.graph, nextprops.graphid);
    } else if (this.props.entityid != null && this.props.entityid !== nextprops.entityid) {
      this.props.graph.translateGraphAroundId(parseInt(nextprops.entityid, 10))
    }
  }

  render() {
    return( 
      <div id="graph-container" style={{"height": this.state.height + "px", "width": this.state.width + "px"}}></div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  debugger;
  return{
      sidebarVisible: state.data.sidebarVisible
  };
}
export default addUrlProps({ urlPropsQueryConfig })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph)));
