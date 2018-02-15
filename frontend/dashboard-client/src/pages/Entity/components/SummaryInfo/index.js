import React, { Component } from 'react';

import { Link } from 'react-router-dom';


class SummaryInfo extends Component {

  render(){

    if (this.props.nodeItem == null) {
      /* if the neo4j node item hasn't loaded yet */
      return (
        <div>No data</div>
      );
    } else if (this.props.nodeRelationships==null) {
      /* after the neo4j node item has loaded */
      return(    
        <div>
          <p>Address: <b>{this.props.nodeItem[0].data.address}</b></p>
          <p>Birth Date: <b>{this.props.nodeItem[0].data.date_of_birth}</b></p>
          <p>Nationality: <b>{this.props.nodeItem[0].data.nationality}</b> </p>
          <p>Occupation:  <b>{this.props.nodeItem[0].data.occupation}</b> </p>
          <br></br>
        </div>
      );
    } else {      
      return(    
        <div>
          <p>Address: <b>{this.props.nodeItem[0].data.address}</b></p>
          <p>Birth Date: <b>{this.props.nodeItem[0].data.date_of_birth}</b></p>
          <p>Nationality: <b>{this.props.nodeItem[0].data.nationality}</b> </p>
          <p>Occupation:  <b>{this.props.nodeItem[0].data.occupation}</b> </p>
          <p>Relationships:</p>
          {this.props.nodeRelationships.map((tuple) =>{
            return(<p>{"Is " + tuple[0].type + " " + tuple[1].self}</p>);
          })}
          <br></br>
        </div>
      );
    }      
  }
}

export default SummaryInfo;