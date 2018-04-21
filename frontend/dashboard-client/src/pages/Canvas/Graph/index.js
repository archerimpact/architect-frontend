import React, { Component, PropTypes } from 'react';
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
  entity: { type: UrlQueryParamTypes.string, queryParam: 'entity'}
} 

const height = window.innerHeight,
  width = Math.max(window.innerWidth - 500);


class Graph extends Component {

  componentWillMount() {
    if (this.props.search != null ){
      if (this.props.entity !== null && this.props.entity !== undefined) {
        this.props.actions.fetchGraphFromId(this.props.graph, this.props.entity);
      }
    }  
  }

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, width, height);
  }

  componentWillReceiveProps(nextprops){
    if (this.props.entity !== nextprops.entity) {
      this.props.actions.fetchGraphFromId(this.props.graph, nextprops.entity);
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

export default withRouter(addUrlProps({ urlPropsQueryConfig })(connect(mapStateToProps, mapDispatchToProps)(Graph)));