import React, { Component } from 'react';

import './style.css'

import EntityCard from '../EntityCard/';

class ConnectionsTab extends Component {

  render(){
    return(
      <div className="tab">
        {this.props.nodeRelationships.map((data, key) => {
          return(
            <div className="connectionCard" key={key}>
              <div>{"Is " + data[0].type + ": "}</div>
              <EntityCard nodeItem={data[2]}/>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ConnectionsTab;