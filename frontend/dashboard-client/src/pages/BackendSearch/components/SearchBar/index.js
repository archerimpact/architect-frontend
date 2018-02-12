import React, { Component } from 'react';

import './style.css'

class Search extends Component {

  constructor() {
    super();
    this.state = {
      searchQuery: ''
    };
  }
  
  componentWillMount() {
    this.search();
  }
  
  search( query = '' ) {
    this.setState({searchQuery: query})
    console.log(this.state.searchQuery);
  }
  
  updateSearch() {
    this.search(this.refs.query.value);
  }


  render (){
    return(
      <div>
        <input className="app_input" ref="query" type="text" onChange={ (e) => this.updateSearch() }/>
        <button onClick={(e) => this.props.onSubmitSearch(this.state.searchQuery)}>Search</button>
      </div>
    )
  }
}
export default Search