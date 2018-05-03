import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './style.css'

import SearchBar from './../SearchBar';

class DatabaseSearchBar extends Component {

  constructor(props) {
    super(props);
    this.goToSearchPage = this.goToSearchPage.bind(this);
  }

  goToSearchPage(query){ 
    var buildCanvasPath = new RegExp('/build/\\S+');
    let newPathname = '';
    if (this.props.location.pathname.includes('/search')) {
      newPathname = this.props.location.pathname;
    } else if (this.props.location.pathname === '/') {
      newPathname = 'explore/search'
    } else if (buildCanvasPath.test(this.props.location.pathname)) {
      newPathname = this.props.location.pathname + '/search'
    }
    
    let searchQuery = query ? 'search=' + query : '';
    let graphQuery = this.props.graphid ? '&graphid=' + this.props.graphid : '';
    this.props.history.push(newPathname + '?' + searchQuery + graphQuery);
  }

  render() {
    return (
      <SearchBar onSubmit={this.goToSearchPage} value={this.props.search} showSettings={this.props.showSettings}/>
    );
  }
}
export default withRouter(DatabaseSearchBar);