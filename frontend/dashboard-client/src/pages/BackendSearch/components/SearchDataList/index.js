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
          <h3> Search Results </h3>
          {this.props.searchItems.map((item)=> {
            return(
              <EntityCard 
                nodeItem={this.props.nodeItems.find((element) => {
                    return element[0].metadata.id===item._source.neo4j_id
                })} 
              />
            );
          })}
        </div>
      );
    }
  }
}

export default SearchDataList;