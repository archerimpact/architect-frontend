import React, { Component } from 'react';

import './style.css'

class SearchBar extends Component {

  constructor() {
    super();
    this.state = {
      searchQuery: ''
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  updateSearch() {
    this.setState({searchQuery: this.refs.query.value});
  }

  submitSearch(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.searchQuery);
  }

  render (){
    return(
      <div className="searchBody">
        <div className="search-input-container">
        <form className="search-form" onSubmit={(e) => this.submitSearch(e)}>
          <input className="search-input" 
            ref="query" 
            type="text" 
            placeholder="Search our connected data"
            onChange={this.updateSearch}
          />
        </form>
        <div className="search-button">
            <span className="fa fa-search fa-lg search-icon" onClick={(e) => this.submitSearch()}></span>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchBar;