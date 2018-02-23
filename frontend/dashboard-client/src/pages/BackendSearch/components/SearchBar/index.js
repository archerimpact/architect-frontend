import React, { Component } from 'react';

import './style.css'

import Search from 'material-ui/svg-icons/action/search';

class SearchBar extends Component {

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
        <div className="input_container">
          <input className="input" 
            ref="query" 
            type="text" 
            placeholder="Search all entities"
            onChange={(e) => this.updateSearch()}
          />
          <Search className="input_img" onClick={(e) => this.props.onSubmitSearch(this.state.searchQuery)}/>
        </div>
      </div>
    );
  }
}
export default SearchBar