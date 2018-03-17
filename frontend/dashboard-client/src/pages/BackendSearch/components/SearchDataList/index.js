import React, { Component } from 'react';

import EntityCard from '../../../../components/EntityCard/';
import SummaryInfo from '../../../Entity/components/SummaryInfo/';
import './style.css'

class SearchDataList extends Component {

  constructor(props){
    super(props);
    this.state = {
      toggled: false
    }
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
              <EntityResult nodeItem={nodeItemData} key={key}/>
            );

          })}
        </div>
      );
    }
  }
}

class EntityResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false
    }
  }

    render() {
      debugger;
      return (
        <div onClick={()=>this.setState({toggled:!this.state.toggled})}>
          <EntityCard 
            nodeItem={this.props.nodeItem} 
            key={this.props.key} 
          />
          {this.state.toggled?<SummaryInfo nodeItem={this.props.nodeItem}/>: null }
        </div>
        )
    }
}

export default SearchDataList;