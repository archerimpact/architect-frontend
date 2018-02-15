import React, { Component } from 'react';

import { Link } from 'react-router-dom';


class SearchEntityCard extends Component {

  render(){

    if (typeof(this.props.nodeItem)==='undefined') {
      /* if the neo4j node item hasn't loaded yet */
      return (
        <div>
          <p>{"elastic_id: " + this.props.searchItem._id}</p>
          <p>{"neo4j_id: " + this.props.searchItem._source.neo4j_id} </p>
          <p>{"Name: " + this.props.searchItem._source.name}</p>
          <p>{"Nationality: " + this.props.searchItem._source.nationality} </p>
        </div>
      );
    } else {
      /* after the neo4j node item has loaded */
      return(    
        <div>
          <p>{"elastic_id: " + this.props.searchItem._id}</p>
          <p>{"neo4j_id: " + this.props.searchItem._source.neo4j_id} </p>
          <p>{"Name: " + this.props.searchItem._source.name}</p>
          <p>{"Nationality: " + this.props.searchItem._source.nationality} </p>
          <Link to={"/entity/" + this.props.searchItem._source.neo4j_id}>Go to Entity</Link>
          <p>{"Some Neo4j data: " + this.props.nodeItem[0].all_relationships} </p>
          <br></br>
        </div>
      );
    }
  }
}

export default SearchEntityCard;