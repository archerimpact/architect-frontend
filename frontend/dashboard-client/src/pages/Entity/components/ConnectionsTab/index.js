import React, { Component } from 'react';

import './style.css'

import EntityCard from '../../../../components/EntityCard/';

class ConnectionsTab extends Component {

  render(){
    return(
      <div className="tab">
        {this.props.nodeRelationships.map((data, key) => {
          return(
            <div className="connectionCard" key={key}>
              <div className="connectionType">
                <div>{"Is " + data[0].type + ": "}</div>
                </div>
                <EntityCard nodeItem={data[1]}/>
              <hr></hr>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ConnectionsTab;