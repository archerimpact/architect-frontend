import React, { Component } from 'react';

import EntityCard from '../../../../components/EntityCard/'

import './style.css'

class SearchDataList extends Component {

  constructor(props){
    super(props);
  }

  render() {
    if (this.props.searchItems == null || this.props.nodeItems==null){
      return (
        <div></div>
      );
    } else {
      return(
        <div className="searchResults">
          {this.props.searchItems.map((item, key)=> {
            var nodeItem = this.props.nodeItems.find((element) => {
              return element[0].metadata.id===item._source.neo4j_id
            })
            let nodeItemData = null;
            if (typeof(nodeItem) !== 'undefined') {
              nodeItemData = nodeItem[0]
            }
            return(
              <EntityCard 
                nodeItem={nodeItemData} 
                key={key} 
              />
            );
          })}
        </div>
      );
    }
  }
}

export default SearchDataList;