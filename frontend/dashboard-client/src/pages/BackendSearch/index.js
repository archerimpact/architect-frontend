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
    this.state={
      searchData: null
    }
  }

  searchBackendText(query){
    server.searchBackendText(query)
      .then((data)=>{
        this.setState({searchData: data.hits.hits})
      })
      .catch((error) => {console.log(error)});
  }
  
  render() {
    return(
      <div>
        <SearchBar onSubmitSearch={this.searchBackendText}/>
        <h3> Search Results </h3>
        <EntitiesList searchItems={this.state.searchData} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  }
}

function mapStateToProps(state, props) {
  return{
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackendSearch);