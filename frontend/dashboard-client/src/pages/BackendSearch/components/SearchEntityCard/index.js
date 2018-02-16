import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class SearchEntityCard extends Component {

  render(){
    let link_data = null
    if (typeof(this.props.nodeItem) !=='undefined') {
      /* after the neo4j node item has loaded */
      link_data = (
        <div>
          <p>{"Some Neo4j data: " + this.props.nodeItem[0].all_relationships} </p>
        </div>
      );
    }

    return (
      <div>
        <Link to={"/entity/" + this.props.searchItem._source.neo4j_id}><h2>{this.props.searchItem._source.name}</h2></Link>
        <p>{"Nationality: " + this.props.searchItem._source.nationality} </p>
        {link_data}
        <hr></hr>
      </div> 
    );
  }
}

export default SearchEntityCard;