import React, { Component } from 'react';
// import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import './style.css'

import SearchBar from './../SearchBar';

import * as server from '../../server/';
import { Redirect } from 'react-router'

// const urlPropsQueryConfig = {
//   search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
//   graphid: { type: UrlQueryParamTypes.string, queryParam: 'graphid'}
// };

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
    //this.props.onChangeSearch(query);
  }

  render() {
    if (this.state.fireRedirect) {
      this.setState({fireRedirect:false});
      return (
        <Redirect to={'/canvas/search?search=' + this.props.search + "&graphid=" + this.props.graphid}  />
      );
    }

    return(
      <div className="searchBody">
        <SearchBar onChange={this.searchBackendText} onSubmit={this.goToSearchPage}/>
      </div>
    );
  }
}
export default DatabaseSearchBar;
// export default addUrlProps({ urlPropsQueryConfig }) (DatabaseSearchBar);