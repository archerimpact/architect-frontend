import React, { Component } from 'react';

import './style.css'

import EntityCard from '../EntityCard/';

class ConnectionsTab extends Component {

  render(){
    return(
      <div className="tab">
        {this.props.nodeRelationships.map((tuple) => {
          return(
            <div className="connectionCard">
              <div>{"Is " + tuple[0].type + ": "}</div>
              <EntityCard nodeItem={tuple[1]}/>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ConnectionsTab;