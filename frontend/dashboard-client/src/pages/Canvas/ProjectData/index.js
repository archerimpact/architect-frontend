import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../Graph/graphActions';
import EntityCard from '../EntityCard';
class ProjectData extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.currentProject === null) {
      return (
        <div>Loading...</div>
      );
    } else {
      return (
        <div className="searchResults">
          { !this.props.currentProject.graphData || !this.props.currentProject.graphData.nodes ? 
            null :
            this.props.currentProject.graphData.nodes.map(node => <EntityCard shouldFetch data={node} />)
          }
        </div>
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
  if (state.data.currentProject) {
    return {
      currentProject: state.data.currentProject
    }
  }
  return {
    currentProject: null
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectData));