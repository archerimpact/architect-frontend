import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './style.css'

import SearchBar from './../SearchBar';

import * as server from '../../server/';

class DatabaseSearchBar extends Component {

  constructor(props) {
    super(props);
    this.goToSearchPage = this.goToSearchPage.bind(this);
  }

  goToSearchPage(query){ 
    let newPathname = this.props.location.pathname === '/' ? 'explore' :  this.props.location.pathname
    let searchQuery = query ? 'search=' + query : ''
    let graphQuery = this.props.graphid ? '&graphid=' + this.props.graphid : '';
    this.props.history.push(newPathname+'/search?' + searchQuery + graphQuery);
  }

  render() {
    return(
      <SearchBar onSubmit={this.goToSearchPage}/>
    );
  }
}
export default withRouter(DatabaseSearchBar);