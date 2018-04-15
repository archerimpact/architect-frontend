import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './graphActions';
import * as server from '../../server/';
import {withRouter } from 'react-router-dom';


import './graph.css'
import ArcherGraph from './components/GraphPackage';

const height = window.innerHeight,
  width = Math.max(window.innerWidth - 500);


class Graph extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    // graph.generateCanvas(width, height);
    debugger
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