import React, { Component } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import './style.css'

import Search from 'material-ui/svg-icons/action/search';
import SearchBar from './../SearchBar';

import * as server from '../../server/';
import { Redirect } from 'react-router'

const urlPropsQueryConfig = {
  search: { type: UrlQueryParamTypes.string },
};

class DatabaseSearchBar extends Component {

  constructor(props) {
    super(props);
    this.searchBackendText = this.searchBackendText.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.state={
      searchData: null,
      fireRedirect: false,
    };
  }

  searchBackendText(query){
    server.searchBackendText(query)
      .then((data)=>{
        this.setState({searchData: data.hits.hits});
      })
      .catch((error) => {console.log(error)});
  }

  goToSearchPage(query){
    this.setState({fireRedirect: true});
    this.props.onChangeSearch(query);
  }

  render() {
    if (this.state.fireRedirect) {
      this.setState({fireRedirect:false});
      return (
        <Redirect to={'/canvas/search?search=' + this.props.search}  />
      );
    }

    return(
      <div className="searchBody">
        <SearchBar onChange={this.searchBackendText} onSubmit={this.goToSearchPage}/>
      </div>
    );
  }
}
export default addUrlProps({ urlPropsQueryConfig }) (DatabaseSearchBar);