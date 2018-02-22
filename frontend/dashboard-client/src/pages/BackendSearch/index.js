import React, { Component } from 'react';

import SearchBar from './components/SearchBar/'
import SearchDataList from './components/SearchDataList/'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import {withRouter } from 'react-router-dom';

class BackendSearch extends Component {

  constructor(props) {
    super(props)
    this.searchBackendText = this.searchBackendText.bind(this);
    this.searchBackendNodes = this.searchBackendNodes.bind(this);
    this.state={
      searchData: null,
      nodesData: null
    }
  }

  searchBackendText(query){
    server.searchBackendText(query)
      .then((data)=>{
        this.setState({searchData: data.hits.hits, nodesData: null})
        var ids = data.hits.hits.map((item) => {
          return item._source.neo4j_id
        })
        this.searchBackendNodes(ids)
      })
      .catch((error) => {console.log(error)});
  }

  searchBackendNodes(idsArray){
    server.getBackendNodes(idsArray)
      .then(data => {
        this.setState({nodesData: data})
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return(
      <div>
        <SearchBar onSubmitSearch={this.searchBackendText}/>
        <SearchDataList searchItems={this.state.searchData} nodeItems={this.state.nodesData}/>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch));