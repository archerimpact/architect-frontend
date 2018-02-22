import React, { Component } from 'react';

import GraphContainer from './components/GraphContainer/'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import {withRouter } from 'react-router-dom';

class Canvas extends Component {

  componentDidMount = () => {
    this.props.actions.fetchConnections(this.props.match.params.id);
    this.props.actions.fetchVertices(this.props.match.params.id);
  };

  componentWillReceiveProps = (newprops) => {
    if (this.props.match.params.id != newprops.match.params.id) {
      this.props.actions.fetchConnections(newprops.match.params.id);
      this.props.actions.fetchVertices(newprops.match.params.id);
    }
  }


  render(){
    if (this.props.status==='isLoading') {
      return (
        <p>Loading...</p>
      );
    } else {
      return (
        <GraphContainer 
          vertexes={this.props.savedVertexes.vertices} 
          connections={this.props.savedConnections.connections} 
        />
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  if (state.data.savedVertices.status === 'isLoading' || state.data.savedConnections.status === 'isLoading') {
    return {
      status: 'isLoading',
    }
  } else {
    return {
      status: 'isLoaded',
      savedVertexes: state.data.savedVertices,
      savedConnections: state.data.savedConnections
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Canvas));