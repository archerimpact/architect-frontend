import React, { Component } from 'react';

import './style.css'

class Search extends Component {

  constructor() {
    super();
    this.state = {
      searchQuery: ''
    };
    this.search = this.search.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }
  
  search( query = '' ) {
    this.setState({searchQuery: query});
    this.props.onSubmitSearch(query)
  }

  updateSearch() {
    this.search(this.refs.query.value);
  }


  render (){
    return(
      <div className="searchBody">
        <input className="app_input" 
          ref="query" 
          type="text" 
          placeholder="Search all entities."
          onChange={(e) => this.updateSearch()}
        />
        <button onClick={(e) => this.props.onSubmitSearch(this.state.searchQuery)}>Search</button>
      </div>
    );
  }
}
export default Search