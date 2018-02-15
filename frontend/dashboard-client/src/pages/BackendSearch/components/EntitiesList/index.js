import React, { Component } from 'react';

import SearchEntityCard from '../SearchEntityCard'

class EntitiesList extends Component {

  constructor(props){
    super(props);
  }

  render() {
    if (this.props.searchItems == null || this.props.nodeItems==null){
      return (
        <div></div>
      )
    }else {
      return(
        <div>
          {this.props.searchItems.map((item)=> {
            return(
              <SearchEntityCard 
                searchItem={item} 
                nodeItem={this.props.nodeItems.find((element) => {
                  if (typeof(element)=== 'undefined') {
                    return null
                  } else {
                    return element[0].metadata.id===item._source.neo4j_id}
                  }
                )} 
              />
          )})}
        </div>
      );
    }
  }
}

export default EntitiesList;