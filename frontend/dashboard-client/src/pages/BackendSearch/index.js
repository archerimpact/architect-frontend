import React, { Component } from 'react';

import './style.css'

import SearchBar from '../SearchBar/'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';

class BackendSearch extends Component {

  render() {
    <SearchBar />
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackendSearch);