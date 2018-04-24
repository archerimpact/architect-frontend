import React, { Component, PropTypes } from 'react';
// import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter } from 'react-router-dom';
import * as actions from './graphActions';

import './graph.css'

// const urlPropsQueryConfig = {
//   /* type specifies the type of encoding necessary, queryParam sets which
//     variable name to look for in this.props */ 

//   search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
//   entityid: { type: UrlQueryParamTypes.integer, queryParam: 'entityid'},
//   graphid: { type: UrlQueryParamTypes.integer, queryParam: 'graphid'},
//   centerid: { type: UrlQueryParamTypes.integer, queryParam: 'centerid'}
// } 

const height = window.innerHeight,
  width = Math.max(window.innerWidth - 500);


class Graph extends Component {

  componentWillMount() {
    if (this.props.search != null ){
      if (this.props.graphid !== null && this.props.graphid !== undefined) {
        this.props.actions.fetchGraphFromId(this.props.graph, this.props.graphid);
      }
    }  
  }

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, width, height);
  }

  componentWillReceiveProps(nextprops){
    if (this.props.graphid !== nextprops.graphid) {
      this.props.actions.fetchGraphFromId(this.props.graph, nextprops.graphid);
    } else if (this.props.entityid != null && this.props.entityid !== nextprops.entityid) {
      this.props.graph.translateGraphAroundId(parseInt(nextprops.entityid))
    }
  }

  render() {
    return( 
      <div id="graph-container" style={{"height": height + "px", "width": width + "px"}}></div>
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
  return{
      canvas: state.canvas
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph));