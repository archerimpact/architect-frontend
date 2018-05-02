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
  }

  componentDidMount() {
    this.props.actions.initializeCanvas(this.props.graph, this.props.width, this.props.height);
  }

  renderProjectToolbar() {
    return (
      <div className="project-toolbar">
        <div className="project-name"> {this.props.project.name} <span className="settings fa fa-cog"></span> </div>
        <div onClick={() => this.props.history.push('/build')}> <span className="back-proj-icon fa fa-angle-left"></span> <span>Back to Projects </span></div>
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
  return{
      height: window.innerHeight,
      width: Math.max(window.innerWidth - sidebarSize),
      project: state.data.currentProject
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph));
