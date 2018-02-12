import React, { Component } from 'react';

class EntitiesList extends Component {

  render() {
    return(
      <div>
        {this.props.searchItems.map((item)=> {return(
          <div>
            <p>{item._id}</p>
            <p>{item._index}</p>
            <p>{"name: " + item._source.name}</p>
            <p>{"neo4j_id: " + item._source.neo4j_id} </p>
            <p>{"links: " + item._source.links}</p>
            <br></br>
          </div>
        )})}
      </div>
    )
  }
}

export default EntitiesList;