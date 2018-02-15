import React, { Component } from 'react';

import { Link } from 'react-router-dom';


class EntityCard extends Component {

  render(){

    if (this.props.nodeItem == null) {
      /* if the neo4j node item hasn't loaded yet */
      return (
        <div>No data</div>
      );
    } else {
      /* after the neo4j node item has loaded */

      if (this.props.nodeItem.metadata.labels[0]==='person'){
        return(    
          <div>
            <h3>{this.props.nodeItem.data.name}</h3>
            <p>{this.props.nodeItem.data.nationality} </p>
            <Link to={"/entity/" + this.props.nodeItem.metadata.id}>Go to Entity</Link>
            <hr></hr>
          </div>
        );
      } else if (this.props.nodeItem.metadata.labels[0]==='corporation'){
        return (
          <div>
            <h3>{this.props.nodeItem.data.name}</h3>
            <p>{this.props.nodeItem.data.nationality} </p>
            <p>{this.props.nodeItem.data.company_status} </p>
            <p>{"Jurisdiction: " + this.props.nodeItem.data.jurisdiction}</p>
            <p>{"Date Created: " + this.props.nodeItem.data.date_of_creation}</p>
            <Link to={"/entity/" + this.props.nodeItem.metadata.id}>Go to Entity</Link>
            <hr></hr>
          </div>
        )
      } else {
        return (
        <p>No type</p>
        )
      }
    }
  }
}

export default EntityCard;