import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class SearchEntityCard extends Component {

  render(){
    let link_data = null
    if (typeof(this.props.nodeItem) !=='undefined') {
      /* after the neo4j node item has loaded */

      link_data = (
        <div>
          <Link to={"/entity/" + this.props.searchItem._source.neo4j_id}>Go to Entity</Link>
          <p>{"Some Neo4j data: " + this.props.nodeItem[0].all_relationships} </p>
        </div>
      );
    }

    return (
      <div>
        <p>{"elastic_id: " + this.props.searchItem._id}</p>
        <p>{"neo4j_id: " + this.props.searchItem._source.neo4j_id} </p>
        <p>{"Name: " + this.props.searchItem._source.name}</p>
        <p>{"Nationality: " + this.props.searchItem._source.nationality} </p>
        {link_data}
      </div> 
    );
  }
}

export default SearchEntityCard;