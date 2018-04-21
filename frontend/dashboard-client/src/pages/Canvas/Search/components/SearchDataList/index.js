import React, { Component } from 'react';

import EntityCard from '../../../../../components/EntityCard/';
import SummaryInfo from '../../../Entity/components/SummaryInfo/';
import './style.css';

class SearchDataList extends Component {

  constructor(props){
    super(props);
    this.state = {
      toggled: false
    };
  }

  render() {
    if (this.props.searchItems == null){
      return (
        <div></div>
      );
    } else {
      return(
        <div className="searchResults">
          {this.props.searchItems.map((item)=> {
            return(
              <EntityResult searchResultItem={item} key={item._source.neo4j_id}/>
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
    };
  }
  
  render() {
    return (
      <div className='entity-result' onClick={()=>this.setState({toggled:!this.state.toggled})}>
        <EntityCard 
          nodeItem={this.props.searchResultItem} 
          key={this.props.key} 
        />
        {this.state.toggled?<SummaryInfo nodeItem={this.props.searchResultItem}/>: null }
      </div>
    );
  }
}

export default SearchDataList;