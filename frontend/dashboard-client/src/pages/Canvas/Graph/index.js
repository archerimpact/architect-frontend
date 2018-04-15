import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './graphActions';

import './graph.css'

const height = window.innerHeight,
  width = Math.max(window.innerWidth - 500);


class Graph extends Component {

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, width, height);
  }

  render() {
    return( 
      <div id="graph-container"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Graph);