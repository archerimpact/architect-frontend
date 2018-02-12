import React, { Component } from 'react';

import SearchBar from './components/SearchBar/'
import EntitiesList from './components/EntitiesList/'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';

class BackendSearch extends Component {

  constructor(props) {
    super(props)
    this.searchBackendText = this.searchBackendText.bind(this);
    this.searchBackendNodes = this.searchBackendNodes.bind(this);
  }

  searchBackendText(query){
    this.props.actions.searchBackendText(query)
  }

  searchBackendNodes(id){
    this.props.actions.searchBackendNodes(id)
  }

  render() {
    if (this.props.status === 'isLoading'){
      return(
        <div>
          <SearchBar onSubmitSearch={this.searchBackendText}/>
          <h3> Search Results </h3>
        </div>
      )
    } else {
      return(
        <div>
          <SearchBar onSubmitSearch={this.searchBackendText}/>
          <h3> Search Results </h3>
          <EntitiesList 
            searchItems={this.props.savedSearchItems.searchItems} 
            onBackendNodeSearch={this.searchBackendNodes} 
          />
        </div>
      )
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
  if (state.data.savedSearchItems.status==='isLoading'){
    return {
      status: 'isLoading'
    }
  }else{ 
    return {
      savedSearchItems: state.data.savedSearchItems
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackendSearch);