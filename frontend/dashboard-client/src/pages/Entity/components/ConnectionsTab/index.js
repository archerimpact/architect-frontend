import React, { Component } from 'react';

import EntityCard from '../EntityCard/';

class ConnectionsTab extends Component {

  render(){
    return(
      <div>
        <h3><u>Connections</u></h3>
        {this.props.nodeRelationships.map((tuple) => {
          return(
            <EntityCard nodeItem={tuple[1]}/>
        )
        })}
      </div>
    )
  }

}

export default ConnectionsTab;