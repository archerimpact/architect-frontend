import React, { Component } from 'react';

import './style.css'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';

class BackendSearch extends Component {

}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  if (state.data.savedEntities.status === 'isLoading' || state.data.savedSources.status === 'isLoading') {
    return {
      status: 'isLoading',
      currentProject: state.data.currentProject
    }
  } else {
    return {
      status: 'isLoaded',
      savedEntities: state.data.savedEntities,
      projects: state.data.projects,
      savedSources: state.data.savedSources,
      currentProject: state.data.currentProject,
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackendSearch);