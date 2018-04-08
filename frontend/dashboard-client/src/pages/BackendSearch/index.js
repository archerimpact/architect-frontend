import React, { Component, PropTypes } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import './style.css'

import DatabaseSearchBar from '../../components/SearchBar/databaseSearchBar'
import SearchDataList from './components/SearchDataList/'
import Neo4jGraphContainer from '../../components/NodeGraph/containers/Neo4jContainer/'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import {withRouter } from 'react-router-dom';

const urlPropsQueryConfig = {
  /* type specifies the type of encoding necessary, queryParam sets which
    variable name to look for in this.props */ 

  search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
} 

class BackendSearch extends Component {

  constructor(props) {
    super(props);
    this.searchBackend = this.searchBackend.bind(this);
    this.searchBackendNodes = this.searchBackendNodes.bind(this);
    this.fetchGraph = this.fetchGraph.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
    this.state={
      searchData: null,
      nodesData: null,
      graphData: null
    }
  }

  componentWillMount(){
    /* handles the case when the URL containts the search params and you're
      linking there directly. Only search if there's params */

    if (this.props.search != null ){
      this.searchBackend(this.props.search);
    }    
  }

  componentWillReceiveProps(nextprops){
    /* handles the case when you are already on backend search and are
      searching again in the nav bar; react only recognizes that there's nextprops */
    this.searchBackend(nextprops.search);
  }

  searchBackend(query){
    server.searchBackendText(query)
      .then((data)=>{
        this.setState( {searchData: data.hits.hits, nodesData: null} );
        this.fetchGraph(data.hits.hits[0]._source.neo4j_id);
        var ids = data.hits.hits.map((item) => {
          return item._source.neo4j_id
        });
        this.searchBackendNodes(ids); //use the neo4jids of the elastic results to get all data
      })
      .catch((error) => { console.log(error); });
  }

  searchBackendNodes(idsArray){
    server.getBackendNodes(idsArray)
      .then(data => {
          this.setState( {nodesData: data} );      
      })
      .catch(err => { console.log(err); });
  }

  fetchGraph(id){
    server.getGraph(id)
      .then(data => {
        /* neo4j returns items in this format: [connection, startNode, endNode] */
        this.setState( {graphData: data} );
      })
      .catch(err => { console.log(err); });
  }

  renderGraph() { //render the graph separately in case the data takes a long time to load
    if (this.state.graphData != null) {
      return(<Neo4jGraphContainer graphData={this.state.graphData} />);
    } 
  }

  render() {
    if (this.state.searchData == null || this.state.nodesData == null) {
      return (
        <div>Loading</div>
      );
    } else {
      return(
        <div>
        {this.renderGraph()}
          <div className="search-side-container">
            <div className="search-side">
              <div className="search-bar">
                <DatabaseSearchBar/>
              </div>
              <SearchDataList searchItems={this.state.searchData} nodeItems={this.state.nodesData}/>
            </div>
          </div> 
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
  return{
  };
}

export default withRouter(addUrlProps({ urlPropsQueryConfig })(connect(mapStateToProps, mapDispatchToProps)(BackendSearch)));