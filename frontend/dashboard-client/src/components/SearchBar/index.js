import React, { Component } from 'react';

import './style.css'

class SearchBar extends Component {

  constructor() {
    super();
    this.submitSearch = this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.refs.query.value = this.props.value ? this.props.value : null;
  }
  componentWillReceiveProps(nextprops) {
    if (this.props.value !== nextprops.value) {
      this.refs.query.value = nextprops.value;
    }
  }

  submitSearch(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.query.value);
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