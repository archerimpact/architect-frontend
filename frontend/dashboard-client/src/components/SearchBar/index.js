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
    this.props.onChange(this.state.searchQuery);
  }

  submitSearch() {
    this.props.onSubmit(this.state.searchQuery);
  }

  render (){
    return(
      <div className="searchBody">
        <div className="input_container">
        <form  onSubmit={() => this.submitSearch()}>
          <input className="input" 
            ref="query" 
            type="text" 
            placeholder="Search all entities"
            onChange={(e) => this.updateSearch()}
          />
          <button className="input_img" onClick={(e) => this.submitSearch()}/>
        </form>
        </div>
      </div>
    );
  }
}
export default SearchBar;