import React, { Component, PropTypes } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import './style.css'

import DatabaseSearchBar from '../../../components/SearchBar/databaseSearchBar'
import SearchDataList from './components/SearchDataList/'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import * as actions from '../../redux/actions/';
import * as server from '../../../server/';
import {withRouter } from 'react-router-dom';
import * as actions from '../Graph/graphActions';

const urlPropsQueryConfig = {
  //  type specifies the type of encoding necessary, queryParam sets which
  //   variable name to look for in this.props  

  search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
  entityid: { type: UrlQueryParamTypes.string, queryParam: 'entityid'}
} 

class BackendSearch extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    /* handles the case when the URL containts the search params and you're
      linking there directly. Only search if there's params */
    if (this.props.search != null ){
      this.props.actions.fetchSearchResults(this.props.graph, this.props.search);
    }    
  }

  componentWillReceiveProps(nextprops){
    /* handles the case when you are already on backend search and are
      searching again in the nav bar; react only recognizes that there's nextprops */
    if (this.props.search != null && this.props.search != nextprops.search){
      if (this.props.entity !== null && this.props.entity !== undefined) {
        this.props.actions.fetchGraphFromId(this.props.entity);
        debugger
      }
      this.props.actions.fetchSearchResults(this.props.search);
    }
  }

  render() {
    if (this.props.searchData == null) {
      return (
        <div>Loading</div>
      );
    } else {
      return(
        <div>
        <div className="search-side-container">
          <div className="search-side">
            <div className="search-bar">
              <DatabaseSearchBar/>
            </div>
            <SearchDataList searchItems={this.props.searchData} newgraphid={true}/>
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
  if (state.data.canvas) {
    return {
      searchData: state.data.canvas.searchData
    }
  }
  return{
    searchData: null
  };
}

export default addUrlProps({ urlPropsQueryConfig })(withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch)));