import React, { Component } from 'react';

class EntitiesList extends Component {

  render() {
    if (this.props.searchItems == null){
      return (
        <div></div>
      )
    }else {
      return(
        <div>
          {this.props.searchItems.map((item)=> {return(
            <div>
              <p>{"elastic_id: " + item._id}</p>
              <p>{"neo4j_id: " + item._source.neo4j_id} </p>
              <p>{"Name: " + item._source.name}</p>
              <p>{"Nationality: " + item._source.nationality} </p>
              <br></br>
            </div>
          )})}
        </div>
      );
    }
  }
}

export default EntitiesList;