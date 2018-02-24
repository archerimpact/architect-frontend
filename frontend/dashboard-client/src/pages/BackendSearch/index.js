import React, { Component, PropTypes } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import SearchBar from './components/SearchBar/'
import SearchDataList from './components/SearchDataList/'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import {withRouter } from 'react-router-dom';

const urlPropsQueryConfig = {
  search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
}

class BackendSearch extends Component {

  static propTypes = {
    search: PropTypes.string,
    onChangeSearch: PropTypes.func,
  }

  _mounted = false;

  constructor(props) {
    super(props)
    this.searchBackendText = this.searchBackendText.bind(this);
    this.searchBackendNodes = this.searchBackendNodes.bind(this);
    this.state={
      searchData: null,
      nodesData: null
    }
    if (props.location.query != null) {
      props.onChangeSearch(props.location.query.search)
    }
  }

  componentWillMount(){
    if (this.props.search != null ){
      this.searchBackendText(this.props.search)
    }    
  }
  componentDidMount(){
    this._mounted=true;
  }
  componentWillUnmount(){
    this._mounted = false;
  }

  componentWillReceiveProps(nextprops){
    this.searchBackendText(nextprops.search)
    if (nextprops.location.query != null) {
      nextprops.onChangeSearch(nextprops.location.query.search)
    }
  }

  searchBackendText(query){
    server.searchBackendText(query)
      .then((data)=>{
        if (this._mounted === true){
          this.setState({searchData: data.hits.hits, nodesData: null})
          var ids = data.hits.hits.map((item) => {
            return item._source.neo4j_id
          })
          this.searchBackendNodes(ids)          
        }
      })
      .catch((error) => {console.log(error)});
  }

  searchBackendNodes(idsArray){
    server.getBackendNodes(idsArray)
      .then(data => {
        if (this._mounted === true) {
          this.setState({nodesData: data})       
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return(
      <div>
        <SearchBar onSubmit={this.searchBackendText} onChange={this.searchBackendText}/>
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

export default withRouter(addUrlProps({ urlPropsQueryConfig })(connect(mapStateToProps, mapDispatchToProps)(BackendSearch)));